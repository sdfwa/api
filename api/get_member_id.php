<?php
require('../functions.php');
date_default_timezone_set('America/Los_Angeles');

function currentDate(){
  return date('Y-m-d');
}
function currentYear(){
  return date('Y');
}

function monthsRemaining($d){
  if(isShopCurrent($d) && isset($d['fldShopExpire'])){
    $date1 = new DateTime(($d['fldShopExpire']);
    $date2 = new DateTime(currentDate());
    $diff = $date2->diff($date1)->format("%a");
    $diff2 = $date1->diff($date2)->format("%a");
    echo $diff;
    echo 'hello';
    echo $diff2;
    // $datadiff = strtotime($d['fldShopExpire'] - strtotime(currentDate()));
    // $days = floor($datediff / (60 * 60 * 24));
    $days = $diff;
    if($days >= 0 && $days <=30){
      return 1;
    }elseif($days >= 31 && $days <=60){
      return 2;
    }elseif($days >= 61 && $days <=90){
      return 3;
    }elseif($days >= 91 && $days <=120){
      return 4;
    }elseif($days >= 121 && $days <=150){
      return 5;
    }elseif($days >= 151 && $days <=180){
      return 6;
    }elseif($days >= 181 && $days <=210){
      return 7;
    }elseif($days >= 211 && $days <=240){
      return 8;
    }elseif($days >= 241 && $days <=270){
      return 9;
    }elseif($days >= 271 && $days <=300){
      return 10;
    }elseif($days >= 301 && $days <=330){
      return 11;
    }elseif($days >= 331 && $days <=366){
      return 12;
    }else{
      return 0;
    }
  }else{
    return 0;
  }
  
}

function isSDFWACurrent($d){
  // 99 is for past presidents otherwise 2016, 2017...
  if(!isset($d) || !is_array($d)){return false;}
  if($d['fldYr'] === '99' || $d['fldYr'] >= currentYear()){
    return true;
  }else{
    return false;
  }
}

function isShopCurrent($d){
  if(!isset($d) || !is_array($d)){return false;}
  if($d['fldShopExpire'] >= currentDate()){
    return true;
  }else{
    return false;
  }
}

function isGoldMember($d){
  if(!isset($d) || !is_array($d)){return false;}
  if(isShopCurrent($d ) && trim(strtolower($d['fldShopType'])) === 'gold'){
    return true;
  }else{
    return false;
  }
}

function isSilverMember($d){
  if(!isset($d) || !is_array($d)){return false;}
  if(isShopCurrent($d) && trim(strtolower($d['fldShopType'])) === 'silver'){
    return true;
  }else{
    return false;
  }
}

function isShopFounder($d){
  // currently just a yes / no (null), but could be 0-999, 1000-10,000,000
  if(!isset($d) || !is_array($d)){return false;}
  if(trim(strtolower($d['fldShopFounder'])) === 'yes'){
    return true;
  }else{
    return false;
  }
}

function isMilitaryDiscount($d){
  // currently E1, E2, E3, E4, E5
  if(!isset($d) || !is_array($d)){return false;}
  if(trim(strtolower($d['fldMilitaryRank'])) === 'e1' ||
    trim(strtolower($d['fldMilitaryRank'])) === 'e2' ||
    trim(strtolower($d['fldMilitaryRank'])) === 'e3' ||
    trim(strtolower($d['fldMilitaryRank'])) === 'e4' ||
    trim(strtolower($d['fldMilitaryRank'])) === 'e5'){
    return true;
  }else{
    return false;
  }
}

function isInitCurrent($d){
  if(!isset($d) || !is_array($d)){return false;}
  if(isShopCurrent($d) || isShopFounder($d) || isMilitaryDiscount($d)){
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
*
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
  $output->shop_type = $Row['fldShopType'];
  $output->military_rank = $Row['fldMilitaryRank']; 
  $output->isSDFWACurrent = isSDFWACurrent($Row);
  $output->isShopCurrent = isShopCurrent($Row);
  $output->isGoldMember = isGoldMember($Row);
  $output->isSilverMember = isSilverMember($Row);
  $output->isShopFounder = isShopFounder($Row);
  $output->isMilitaryDiscount = isMilitaryDiscount($Row);
  $output->isInitCurrent = isInitCurrent($Row);
  $output->months_remaining = monthsRemaining($Row);
  $output->currentDate = currentDate($Row);
  $output->currentYear = currentYear($Row);
}else{
  $output = json_decode('{}');
  $output->success = 'false';
  $output->message = 'no results found';
  $output->referer = $referer;
  $output->email= $email;
  $output->isSDFWACurrent = false;
  $output->isShopCurrent = false;
  $output->isGoldMember = false;
  $output->isSilverMember = false;
  $output->isShopFounder = false;
  $output->isMilitaryDiscount = false;
  $output->isInitCurrent = false;
}
echo json_encode($output, JSON_PRETTY_PRINT);
if(isDebug()){
  echo print_r($Row);
}

mssql_close($con);
