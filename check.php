<?php
require('./functions.php');

if(isset($_GET['member_id']) && $_GET['member_id'] !== ''){
  $member_id = $_GET['member_id'];
}else{
  debug('no member id');
  exit();
}

// jQuery.getJSON("http://api.briankranson.com/check.php?member_id=1234").done(function(data){console.log(data)});
$query = $select_query;
$query = str_replace('{{member_id}}', $member_id, $query);
$query = str_replace('{{current_time}}', $current_time, $query);
debug('select_query', $query);
$statement = $db->query($query);
$row_count = $statement->rowCount();
debug('row count', $row_count);
if($row_count == 1){
  $row = $statement->fetch(PDO::FETCH_ASSOC);
  $start_time = $row['start_time'];
  $end_time = $row['end_time'];
  $current_time = $row['current_time'];
  $output = json_decode('{}');
  $output->successs = 'true';
  $output->message = 'you have access';
  $output->member_id = $member_id;
  $output->start_time = $start_time;
  $output->end_time = $end_time;
  echo json_encode($output);
}else{
  $output = json_decode('{}');
  $output->successs = 'false';
  $output->message = 'you do not have access at this time, try checking in at the check in counter';
  $output->member_id = $member_id;
  echo json_encode($output);
}

?>