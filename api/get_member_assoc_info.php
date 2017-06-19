<?php
require('../functions.php');

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
$host = '';
if(isset($_SERVER['HTTP_REFERER'])) {
  $host = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);
}

if(isset($_GET['host']) && $_GET['host'] !== '' && preg_match("/punchpass/i", $_GET['host'])){
  $host= 'punchpass.net';
}

if (!preg_match("/punchpass\.net/i", $host)) {
  debug('wrong host');
  exit();
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
  $output->success = 'true';
  $output->message = 'results found';
  $output->host = $host;
  $output->last_name = trim($Row['fldLastName']);
  $output->first_name = trim($Row['fldFirstName']);
  $output->middle_initial = trim($Row['fldMiddleInit']);
  $output->name_prefix = trim($Row['fldPrefix']);
  $output->name_suffix = trim($Row['fldSuffix']);
  $output->spouse = trim($Row['fldSpouse']);
  $output->address = trim($Row['fldAddress']);
  $output->city = trim($Row['fldCity']);
  $output->state = trim($Row['fldState']);
  $output->zip_code = trim($Row['fldZipCode']);
  $output->phone = trim($Row['fldPhone']);
  $output->year = trim($Row['fldYr']);
  $output->shop_expire = $Row['fldShopExpire'];
  $output->share = trim($Row['fldShare']);
  $output->email = trim($Row['fldEMail']);
  $output->mail = trim($Row['fldMail']);
  $output->date_joined = $Row['fldJoined'];
  $output->date_carded = $Row['fldCarded'];
  $output->comments = trim($Row['fldComments']);
  $output->life_member = trim($Row['fldLifeMember']);
  $output->date = $Row['fldDate'];
  $output->email2 = trim($Row['fldEmail2']);
  $output->phone2 = trim($Row['fldPhone2']);
  $output->member_id = trim(substr("0000" . $Row['MemberID'], -4));
  echo json_encode($output, JSON_PRETTY_PRINT);
}else{
  $output = json_decode('{}');
  $output->success = 'false';
  $output->message = 'no results found';
  $output->host = $host;
  if(isset($member_id)){
    $output->member_id = $member_id;
  }
  if(isset($email)){
    $output->email= $email;
  }
  echo json_encode($output, JSON_PRETTY_PRINT);
}

mssql_close($con);
