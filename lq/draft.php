<?php
require_once('./before.php');
while (($row = fgetcsv($g->read_file)) !== false) {
  if(!$g->haveHeader){
    $g->haveHeader = true;
    $g->header = getHeader($row);
  }
  $results = json_decode("[]");
  foreach($row as $column){
    array_push($results, trim($column));
  }
  fputcsv($g->write_test, $results);
}
require_once('./after.php');
?>