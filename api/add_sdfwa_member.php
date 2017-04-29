<?php
require('../functions.php');

if(isset($_GET['email']) && $_GET['email'] !== ''){
  $email= strtolower($_GET['email']);
}

if(isset($_GET['first_name']) && $_GET['first_name'] !== ''){
  $first_name= strtoupper($_GET['first_name']);
}

if(isset($_GET['last_name']) && $_GET['last_name'] !== ''){
  $last_name= strtoupper($_GET['last_name']);
}

if(isset($_GET['year']) && $_GET['year'] !== ''){
  $year= strtoupper($_GET['year']);
}

if(isset($_GET['comment']) && $_GET['comment'] !== ''){
  $comment= strtoupper($_GET['comment']);
}

if(!isset($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || !isset($first_name) || !isset($last_name) || !isset($year) || !isset($comment)){
  debug('no member email or first name or last name or year or comment');
  exit();
}

$referer = '';
if(isset($_SERVER['HTTP_REFERER'])) {
    $referer = $_SERVER['HTTP_REFERER'];
}

$con = mssql_connect($MSSQLServer, $MSSQLUser, $MSSQLPass) or die("Could not connect to database: ".mssql_get_last_message()); 
// Select a database:
mssql_select_db('SDFWA') 
    or die('Could not select a database.');

$SQL = <<<QUERY_END
SELECT TOP 1
(MAX(memberID) + 1) as next_member_id
FROM davism.tblSDFWAMembers
;
QUERY_END;

$SQL2 = <<<QUERY_END
SELECT TOP 1
*
FROM davism.tblSDFWAMembers
WHERE fldEmail = '{{email}}' 
;
QUERY_END;

$SQL2 = str_replace("{{email}}",  $email, $SQL2);

$ADD_SQL = <<<QUERY_END
INSERT INTO davism.tblSDFWAMembers
(memberID, fldEmail, fldFirstName, fldLastName, fldYr, fldComments, fldJoined)
VALUES ({{next_member_id}}, '{{email}}', '{{first_name}}', '{{last_name}}', '{{year}}', '{{comment}}', '{{current_time}}')
;
QUERY_END;

// Execute query:
$result = mssql_query($SQL) 
    or die('A error occured: ' . mysql_error());

// Get max row result count:
$row_count = mssql_num_rows($result);

if($row_count == 1){
  $Row = mssql_fetch_assoc($result);
  $next_member_id = $Row['next_member_id'];

  // Execute query:
  $result = mssql_query($SQL2) 
      or die('A error occured: ' . mysql_error());

  // Get email result count:
  $row_count = mssql_num_rows($result);
  if($row_count != 1){
    $ADD_SQL = str_replace("{{next_member_id}}",  $next_member_id, $ADD_SQL);
    $ADD_SQL = str_replace("{{email}}",  $email, $ADD_SQL);
    $ADD_SQL = str_replace("{{first_name}}",  $first_name, $ADD_SQL);
    $ADD_SQL = str_replace("{{last_name}}",  $last_name, $ADD_SQL);
    $ADD_SQL = str_replace("{{year}}",  $year, $ADD_SQL);
    $ADD_SQL = str_replace("{{comment}}",  $comment, $ADD_SQL);
	$ADD_SQL = str_replace("{{current_time}}",  $current_time, $ADD_SQL);
    debug($ADD_SQL);
    // Execute query:
    $result = mssql_query($ADD_SQL) 
        or die('A error occured: ' . mysql_error());

    // Get add count:
    $row_count = mssql_rows_affected($con);

    $output = json_decode('{}');
    $output->referer = $referer;
    $output->member_id = $next_member_id;
    $output->email = $email;
    $output->first_name = $first_name;
    $output->last_name = $last_name;
    $output->year = $year;
    $output->comment = $comment;
    if($row_count > 0){  
      $output->success = 'true';
      $output->message = 'add complete';
    }else{
      $output->success = 'false';
      $output->message = 'something went wrong';
    }
    echo json_encode($output, JSON_PRETTY_PRINT);

    mssql_close($con);
  }
}

