<?php
require('../functions.php');

if(isset($_GET['email']) && $_GET['email'] !== ''){
  $email= strtolower($_GET['email']);
}

if(isset($_GET['military_rank']) && $_GET['military_rank'] !== ''){
  $email= strtolower($_GET['military_rank']);
}

if(!isset($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || !isset($military_rank)){
  debug('no member email or military rank');
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
UPDATE davism.tblSDFWAMembers
SET fldMilitaryRank = {{military_rank}}
WHERE LOWER(fldEMail) = '{{email}}'
;
QUERY_END;

$SQL = str_replace("{{email}}",  $email, $SQL);
$SQL = str_replace("{{military_rank}}",  $military_rank, $SQL);

// Execute query:
$result = mssql_query($SQL) 
    or die('A error occured: ' . mysql_error());

// Get update count:
$row_count = mssql_rows_affected($con);
    

$output = json_decode('{}');
$output->referer = $referer;
$output->email = $email;
$output->military_rank = $military_rank;
if($row_count > 0){  
  $output->success = 'true';
  $output->message = 'update complete';
}else{
  $output->success = 'false';
  $output->message = 'something went wrong';
}
echo json_encode($output, JSON_PRETTY_PRINT);

mssql_close($con);