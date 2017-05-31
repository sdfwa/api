<?php
require_once('./helper.php');
$g->read_file = fopen($g->local_in_dir . $g->local_in_file, "r");
$g->write_file = fopen($g->local_out_dir . $g->local_out_file, "w");
while (($row = fgetcsv($g->read_file)) !== false) {
  $results = json_decode("[]");
  foreach($row as $column){
    array_push($results, $column);
  }
  fputcsv($g->write_file, $results);
}
fclose($g->read_file);
fclose($g->write_file);
?>