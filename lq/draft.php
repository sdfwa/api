<?php
require_once('./before.php');
while (($row = fgetcsv($g->in_handle)) !== false) {
  $g->write_contact = false;
  $g->write_event = false;
  $g->write_supplement = false;
  if(!$g->have_read_header){
    $g->have_read_header = true;
    $g->write_contact = true;
    $g->write_event = true;
    $g->write_supplement = true;
    $g->header = getHeader($row);
  }
  $results = json_decode("[]");
  foreach($row as $column){
    array_push($results, trim($column));
  }
  fputcsv($g->out_test_handle, $results);
  if($g->write_contact){
    fputcsv($g->out_contact_handle, $results);
  }
  if($g->write_event){
    fputcsv($g->out_event_handle, $results);
  }
  if($g->write_supplement){
    fputcsv($g->out_supplement_handle, $results);
  }
}
require_once('./after.php');
?>