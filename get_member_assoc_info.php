<?php
require('./functions.php');

if(isset($_GET['member_id']) && $_GET['member_id'] !== ''){
  $member_id = $_GET['member_id'];
}

if(isset($_GET['email']) && $_GET['email'] !== ''){
  $email= $_GET['email'];
}

if(!isset($member_id) && !isset($email)){
  debug('no member id OR email');
  exit();
}

if(isset($member_id) && isset($email)){
  debug('both member id and email');
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
fldLastName
, fldFirstName
, fldMiddleInit
, fldPrefix
, fldSuffix
, fldSpouse
, fldAddress
, fldCity
, fldState
, fldZipCode
, fldPhone
, fldYr
, fldShare
, fldEMail
, fldMail
, fldJoined
, fldCarded
, fldComments
, fldLifeMember
, fldDate
, fldEmail2
, fldPhone2
, MemberID
FROM davism.tblSDFWAMembers
{{WHERE}}
;
QUERY_END;
if(isset($member_id)){
  $SQL = str_replace("{{WHERE}}",  "WHERE MemberID = " . $member_id, $SQL);
}

if(isset($email)){
  $SQL = str_replace("{{WHERE}}",  "WHERE fldEMail LIKE '%" . $email . "%'", $SQL);
}


// Execute query:
$result = mssql_query($SQL) 
    or die('A error occured: ' . mysql_error());

// Get result count:
$row_count = mssql_num_rows($result);
// print "Showing $count rows:<hr/>\n\n";


if($row_count == 1){
  $Row = mssql_fetch_assoc($result);
  $output = json_decode('{}');
  $output->successs = 'true';
  $output->message = 'results found';
  $output->referer = $referer;
  $output->last_name = $Row['fldLastName'];
  $output->first_name = $Row['fldFirstName'];
  $output->middle_initial = $Row['fldMiddleInit'];
  $output->name_prefix = $Row['fldPrefix'];
  $output->name_suffix = $Row['fldSuffix'];
  $output->spouse = $Row['fldSpouse'];
  $output->address = $Row['fldAddress'];
  $output->city = $Row['fldCity'];
  $output->state = $Row['fldState'];
  $output->zip_code = $Row['fldZipCode'];
  $output->phone = $Row['fldPhone'];
  $output->year = $Row['fldYr'];
  $output->share = $Row['fldShare'];
  $output->email = $Row['fldEMail'];
  $output->mail = $Row['fldMail'];
  $output->date_joined = $Row['fldJoined'];
  $output->date_carded = $Row['fldCarded'];
  $output->comments = $Row['fldComments'];
  $output->life_member = $Row['fldLifeMember'];
  $output->date = $Row['fldDate'];
  $output->email2 = $Row['fldEmail2'];
  $output->phone2 = $Row['fldPhone2'];
  $output->member_id = substr("0000" . $Row['MemberID'], -4);
  echo json_encode($output, JSON_PRETTY_PRINT);
}else{
  $output = json_decode('{}');
  $output->successs = 'false';
  $output->message = 'no results found';
  $output->referer = $referer;
  if(isset($member_id)){
    $output->member_id = $member_id;
  }
  if(isset($email)){
    $output->email= $email;
  }
  echo json_encode($output, JSON_PRETTY_PRINT);
}

mssql_close($con);
