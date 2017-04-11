<?php
require('../functions.php');
$user_id = '';
$password = '';
if($GLOBALS['debug'] === true && isset($_GET['user_id']) && $_GET['user_id'] !== '' && isset($_GET['password']) && $_GET['password'] !== ''){
  $user_id = $_GET['user_id'];
  $password = $_GET['password']; 
}
$raw_post_data = file_get_contents("php://input");
debug(raw_post_data, $raw_post_data);
if(isset($raw_post_data) && startsWith($raw_post_data, '{') && endsWith($raw_post_data, '}')){
  $json_data = json_decode($raw_post_data);
}
if(isset($json_data->user_id) && $json_data->user_id !== '' && isset($json_data->password) && $json_data->password !== ''){
  $user_id = $json_data->user_id;
  $password = $json_data->password; 
}

if($user_id === '' && $password === ''){
  debug('need to supply a user id and password');
  exit();
}

$select_user_query = <<<QUERY_END
SELECT *
, '{{current_time}}' AS `current_time`
FROM users
WHERE user_id = '{{user_id}}'
AND '{{current_time}}' < end_time
ORDER BY start_time DESC
limit 1
;
QUERY_END;

$insert_query = <<<QUERY_END
INSERT INTO users
(
  user_id
  , token
  , start_time
  , end_time
)
VALUES
(
  '{{user_id}}'
  , '{{token}}'
  , '{{start_time}}'
  , '{{end_time}}' 
)
;
QUERY_END;

$update_user_query = <<<QUERY_END
UPDATE users
(
  user_id
  , token
  , start_time
  , end_time
)
VALUES
(
  '{{user_id}}'
  , '{{token}}'
  , '{{start_time}}'
  , '{{end_time}}' 
)
WHERE user_id == '{{user_id}}'
;
QUERY_END;

// jQuery.ajax({
//     url: "http://api.briankranson.com/login.php",
//     type: "POST",
//     data: JSON.stringify({"user_id":"api_user","password":"api_password"}),
//     contentType: "application/json",
//     complete: function(data) {
//       if(data.readyState === 4){
//          var json_data = JSON.parse(data.responseText);
//          console.log(json_data);
//          window.bk_api_token = json_data.token;
//          sessionStorage.setItem('bk_api_token', bk_api_token);
//       }
//     }
// });
if($user_id === 'api_user' && $password === 'api_password'){
  $query = $select_user_query;
  $query = str_replace('{{user_id}}', $user_id, $query);
  $query = str_replace('{{current_time}}', $current_time, $query);
  debug('select_query', $query);
  $statement = $db->query($query);
  $row_count = $statement->rowCount();
  debug('row count', $row_count);
  $start_time = date('Y-m-d H:i:s');
  $end_time = date('Y-m-d H:i:s', strtotime("$start_time + 24 hours"));
  $output = json_decode('{}');
  $output->user_id = $user_id;
  $output->successs = 'true';
  if($row_count == 1){
    $row = $statement->fetch(PDO::FETCH_ASSOC);
    $row_id = $row['id'];
    $user_id = $row['user_id'];
    $start_time = $row['start_time'];
    $token = $row['token'];
    debug('found', $row_id.' '.$user_id.' '.$token.' '.$start_time.' '.$current_time.' '.$end_time);
    $query = $update_user_query;
    $query = str_replace('{{user_id}}', $user_id, $query);
    $query = str_replace('{{token}}', $token, $query);
    $query = str_replace('{{start_time}}', $start_time, $query);
    $query = str_replace('{{end_time}}', $end_time, $query);
    debug('update_query', $query);
    $result = $db->exec($query);
    $output->message = 'end time updated';
  }else{
    $token = guidv4(openssl_random_pseudo_bytes(16));
    $query = $insert_query;
    $query = str_replace('{{user_id}}', $user_id, $query);
    $query = str_replace('{{token}}', $token, $query);
    $query = str_replace('{{start_time}}', $start_time, $query);
    $query = str_replace('{{end_time}}', $end_time, $query);
    debug('insert_query', $query);
    $result = $db->exec($query);
    $insert_id = $db->lastInsertId();
    debug('added', $insert_id);
    $output->message = 'token created';
  }
  $output->token = $token;
  $output->start_time = $start_time;
  $output->end_time = $end_time;
  echo json_encode($output);
}

?>