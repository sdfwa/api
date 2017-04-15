<?php
require('../functions.php');
date_default_timezone_set('America/Los_Angeles');

function currentDate(){
  return date('Y-m-d');
}
function currentYear(){
  return date('Y');
}

function isSDFWACurrent($d){
  if(!isset($d) || !is_array($d)){return false;}
  if($d['fldYr'] === '99' || $d['fldYr'] >= currentYear()){
    return true;
  }else{
    return false;
  }
}

function isShopCurrent($d){
  if(!isset($d) || !is_array($d)){return false;}
  if($d['fldShopExpire'] > currentDate()){
    return true;
  }else{
    return false;
  }
}


if(isset($_GET['email']) && $_GET['email'] !== ''){
  $email= strtolower($_GET['email']);
}

if(!isset($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)){
  debug('no member email');
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
MemberID
, fldYr
, fldShopExpire
FROM davism.tblSDFWAMembers
WHERE LOWER(fldEMail) LIKE '%{{email}}%'
;
QUERY_END;

$SQL = str_replace("{{email}}",  $email, $SQL);

// Execute query:
$result = mssql_query($SQL) 
    or die('A error occured: ' . mysql_error());

// Get result count:
$row_count = mssql_num_rows($result);

if($row_count == 1){
  $Row = mssql_fetch_assoc($result);
  $output = json_decode('{}');
  $output->success = 'true';
  $output->message = 'results found';
  $output->referer = $referer;
  $output->email = $email;
  $output->member_id = substr("0000" . $Row['MemberID'], -4);
  $output->year = trim($Row['fldYr']);
  $output->shop_expire = $Row['fldShopExpire'];
  $output->isSDFWACurrent = isSDFWACurrent($Row);
  $output->isShopCurrent = isShopCurrent($Row);
}else{
  $output = json_decode('{}');
  $output->success = 'false';
  $output->message = 'no results found';
  $output->referer = $referer;
  $output->email= $email;
}
echo json_encode($output, JSON_PRETTY_PRINT);

mssql_close($con);
