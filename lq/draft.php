<?php
require_once('./before.php');
while (($row = fgetcsv($g->in_handle)) !== false) {
  $g->write_debug = false;
  $g->write_contact = false;
  $g->write_event = false;
  $g->write_supplement = false;
  $results_test = json_decode("[]");
  $results_contact = json_decode("[]");
  $results_event = json_decode("[]");
  $results_supplement = json_decode("[]");
  if(!$g->have_read_header){
    $g->have_read_header = true;
    $g->write_debug = true;
    $g->write_contact = true;
    $g->write_event = true;
    $g->write_supplement = true;
    $g->header = getHeader($row);
  }
  foreach($row as $column){
    if($g->debug){
      $g->write_debug = true;
      array_push($results_test, trim($column));
    }
  }
  if($g->write_debug){
    fputcsv($g->out_test_handle, $results_test);
  }
  if($g->write_contact){
    fputcsv($g->out_contact_handle, $results_contact);
  }
  if($g->write_event){
    fputcsv($g->out_event_handle, $results_event);
  }
  if($g->write_supplement){
    fputcsv($g->out_supplement_handle, $results_supplement);
  }
}
require_once('./after.php');
?>