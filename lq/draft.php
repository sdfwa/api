<?php
require_once('./before.php');
while (($row = fgetcsv($g->in_dir . $g->in_file)) !== false) {
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
  if($g->write_contact){
    fputcsv($g->out_dir . $g->out_contact, $results);
  }
  if($g->write_event){
    fputcsv($g->out_dir . $g->out_event, $results);
  }
  if($g->write_supplement){
    fputcsv($g->out_dir . $g->out_supplement, $results);
  }
}
require_once('./after.php');
?>