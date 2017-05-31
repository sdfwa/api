<?php
$g = json_decode("{}");
$g->debug = false;
$g->local_in_dir = "/var/github/shop/lq/";
$g->local_in_file = "20170531_trigger_first_100.csv";
$g->local_out_dir = "/var/lq/";
$g->local_out_test = "20170531_trigger_first_100.out";
$g->read_file = fopen($g->local_in_dir . $g->local_in_file, "r");
$g->write_test = fopen($g->local_out_dir . $g->local_out_test, "w");
$g->haveHeader = false;
$g->header = json_decode("[]");

if(isset($_GET["debug"]) && $_GET["debug"] === "true"){
  $g->debug = true;
}

function getHeader($row){
  $results = json_decode("{}");
  $i = 0;
  foreach($row as $column){
    $results[$column] = $i;
    $i++;
  }
  return $results;
}