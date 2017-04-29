<?php
require('../functions.php');

if(isset($_GET['email']) && $_GET['email'] !== ''){
  $email= strtolower($_GET['email']);
}

if(isset($_GET['shop_expire']) && preg_match("/[0-9][0-9][0-9][0-9]\-[0-9][0-9]\-[0-9][0-9]/", $_GET['shop_expire'])){
  $shop_expire= strtoupper($_GET['shop_expire']);
}

if(!isset($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || !isset($shop_expire) ||!preg_match('/^2[0-1][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/', $shop_expire)){
  debug('no member email or shop expire');
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
SET fldShopExpire = '{{shop_expire}}'
WHERE LOWER(fldEMail) = '{{email}}'
;
QUERY_END;

$SQL = str_replace("{{email}}",  $email, $SQL);
$SQL = str_replace("{{shop_expire}}",  $shop_expire, $SQL);

// Execute query:
$result = mssql_query($SQL) 
    or die('A error occured: ' . mysql_error());

// Get update count:
$row_count = mssql_rows_affected($con);
    

$output = json_decode('{}');
$output->referer = $referer;
$output->email = $email;
$output->shop_expire = $shop_expire;
if($row_count > 0){  
  $output->success = 'true';
  $output->message = 'update complete';
}else{
  $output->success = 'false';
  $output->message = 'something went wrong';
}
echo json_encode($output, JSON_PRETTY_PRINT);

mssql_close($con);