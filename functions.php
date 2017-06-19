<?php
require($_SERVER["DOCUMENT_ROOT"] . '/_config.php');
date_default_timezone_set('America/Los_Angeles');
function debug($t, $u=null){
  if($GLOBALS['debug'] == true && isset($t)){
    echo '/*' . PHP_EOL;
    if(isset($u)){
      echo $t . PHP_EOL;
      echo $u . PHP_EOL;
    }else{
      echo $t . PHP_EOL;
    }
    echo '*/' . PHP_EOL;
  }
}

function isDebug(){
  if($GLOBALS['debug'] == true){
    return true;
  }else{
    return false;
  }
}

function guidv4($data){
    assert(strlen($data) == 16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function startsWith($haystack, $needle) {
  // search backwards starting from haystack length characters from the end
  return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== false;
}

function endsWith($haystack, $needle) {
  // search forward starting from end minus needle length characters
  return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== false);
}
$current_time = date('Y-m-d H:i:s');
$GLOBALS['debug'] = false;
if(isset($_GET['debug']) && $_GET['debug'] == 'true'){
  $GLOBALS['debug'] = true;
}
header('Access-Control-Allow-Credentials:true');
if(isset($_SERVER['HTTP_ORIGIN'])){
	$origin = $_SERVER['HTTP_ORIGIN'];
}else{
	$origin = '*';
}
header('Access-Control-Allow-Origin:' . $origin);
header('Access-Control-Expose-Headers:X-Region');
//Allow from any origin
// if (isset($_SERVER['HTTP_ORIGIN'])) {
//     header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
//     header("Access-Control-Allow-Headers: X-Requested-With");
//     header('Access-Control-Allow-Credentials: true');
//     header('Access-Control-Max-Age: 86400');    // cache for 1 day
// }else{
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
// }

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    //if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])){
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    //}
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])){
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    //exit(0);
}

//Setup headers
header("Cache-Control: no-cache, must-revalidate"); // Make it so the file can't be cached
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
if($GLOBALS['debug'] == true || preg_match("/get_member_assoc_info\.php/i", $_SERVER["PHP_SELF"])){
  header("Content-Type: text/html"); //Set that the returned file is JS
  debug('debug on', $current_time);
}else{
  header("Content-Type: application/json"); //Set that the returned file is JS
  // header("Content-Type:text/javascript"); //Set that the returned file is JS
}
if("OPTIONS" == $_SERVER['REQUEST_METHOD']) {
    exit(0);
}

$select_query = <<<QUERY_END
SELECT *
, '{{current_time}}' AS `current_time`
FROM access
WHERE member_id = {{member_id}}
AND '{{current_time}}' < end_time
ORDER BY start_time DESC
limit 1
;
QUERY_END;

$delete_query = <<<QUERY_END
DELETE
FROM {{database}}
WHERE '{{current_time}}' > end_time
;
QUERY_END;

$query = $delete_query;
$query = str_replace('{{current_time}}', $current_time, $query);
$query = str_replace('{{database}}', 'access', $query);
debug('delete_member_access_query', $query);
$statement = $db->query($query);

$query = $delete_query;
$query = str_replace('{{current_time}}', $current_time, $query);
$query = str_replace('{{database}}', 'users', $query);
debug('delete_user_access_query', $query);
$statement = $db->query($query);

