<?php
require('./functions.php');

$count_inputs = 0;
if(isset($_GET['member_id']) && $_GET['member_id'] !== ''){
  $member_id = $_GET['member_id'];
  $count_inputs++;
}

if(isset($_GET['email']) && $_GET['email'] !== ''){
  $email= $_GET['email'];
  $count_inputs++;
}

if(isset($_GET['last_name']) && $_GET['last_name'] !== ''){
  $last_name= $_GET['last_name'];
  $count_inputs++;
}
$user = false;
if(isset($_GET['user']) && $_GET['user'] !== ''){
  $user=true;
  setcookie("user", $_GET['user'], time()+60*60*24*365);
}
if(isset($_COOKIE['user']) && $_COOKIE['user'] !== ''){
  $user=true;
}

?>
<?php if($count_inputs === 0){ header("Content-Type: text/html");?>
<!DOCTYPE html>
<html>
<body>
  <form action=<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?> method="GET">
      Search Last Name: <input type="text" name="last_name"<br>
      OR<br>
      Search Email: <input type="text" name="email"<br>
      OR<br>
      Search Member ID: <input type="text" name="member_id"<br>
      <input type="submit">
  </form>
</body>
</html>

<?php exit(); } ?>
<?php
if($count_inputs > 1){
  debug('can only use one input query string parameter');
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
  if(!$user){
    debug('wrong host');
    exit();
  }
}

$con = mssql_connect($MSSQLServer, $MSSQLUser, $MSSQLPass) or die("Could not connect to database: ".mssql_get_last_message()); 
// Select a database:
mssql_select_db('SDFWA') 
    or die('Could not select a database.');

$SQL = <<<QUERY_END
SELECT TOP 10
fldFirstName
, fldMiddleInit
, fldLastName
, fldPrefix
, fldSuffix
, fldSpouse
, fldAddress
, fldCity
, fldState
, fldZipCode
, fldPhone
, fldYr
, fldEMail
, fldJoined
, fldCarded
, fldLifeMember
, MemberID
, fldShopExpire
, fldShopFounder
, fldMilitaryRank
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

if(isset($last_name)){
  $SQL = str_replace("{{WHERE}}",  "WHERE fldLastName LIKE '%" . $last_name. "%'", $SQL);
}


// Execute query:
$result = mssql_query($SQL) 
    or die('A error occured: ' . mysql_error());

// Get result count:
$row_count = mssql_num_rows($result);
// print "Showing $count rows:<hr/>\n\n";



$array_out= json_decode('[]');
if($row_count > 0){
  while ($Row = mssql_fetch_assoc($result)) { 
    $output = json_decode('{}');
    $output->success = 'true';
    $output->message = 'results found';
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
    $output->email = trim($Row['fldEMail']);
    $output->date_joined = $Row['fldJoined'];
    $output->date_carded = $Row['fldCarded'];
    $output->life_member = trim($Row['fldLifeMember']);
    $output->member_id = trim(substr("0000" . $Row['MemberID'], -4));
    $output->shop_expire= trim($Row['fldShopExpire']);
    $output->shop_founder= trim($Row['fldShopFounder']);
    $output->military_rank= trim($Row['fldMilitaryRank']);
    array_push($array_out, $output);
  }
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
  array_push($array_out, $output);;
}
header("Content-Type: application/json");
echo json_encode($array_out, JSON_PRETTY_PRINT);

mssql_close($con);
