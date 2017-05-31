<?php
require_once('./before.php');
while (($row = fgetcsv($g->in_handle)) !== false) {
  $g->write_debug = false;
  $g->write_contact = false;
  $g->write_event = false;
  $g->write_supplement = false;
  $results_debug = json_decode("[]");
  $results_contact = json_decode("[]");
  $results_event = json_decode("[]");
  $results_supplement = json_decode("[]");
  if(!$g->have_read_header){
    $g->have_read_header = true;
    $g->read_header = getHeader($row);
    if($g->debug){
      $g->write_debug = true;
      foreach($row as $column){
        array_push($results_debug, trim($column));
      }
    }  
  }else{
    if($g->debug){
      $g->write_debug = true;
      foreach($row as $column){
        array_push($results_debug, trim($column));
      }
    } 
  }
  if($g->write_debug){
    fputcsv($g->out_debug_handle, $results_debug);
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