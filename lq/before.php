<?php
$g = json_decode("{}");
$g->debug = false;
$g->in_dir = "/var/github/shop/lq/";
$g->in_file = "20170531_trigger_first_100.csv";
$g->out_dir = "/var/lq/";
$g->out_debug = "20170531_trigger_first_100_debug.out";
$g->out_contact = "20170531_trigger_first_100_contact.out";
$g->out_event = "20170531_trigger_first_100_event.out";
$g->out_supplement = "20170531_trigger_first_100_supplement.out";
$g->in_handle = fopen($g->in_dir . $g->in_file, "r");
$g->out_debug_handle = fopen($g->out_dir . $g->out_debug, "w");
$g->out_contact_handle = fopen($g->out_dir . $g->out_contact, "w");
$g->out_event_handle = fopen($g->out_dir . $g->out_event, "w");
$g->out_supplement_handle = fopen($g->out_dir . $g->out_supplement, "w");
$g->have_read_header = false;

if(isset($_GET["debug"]) && $_GET["debug"] === "true"){
  $g->debug = true;
}

function getHeader($row){
  $results = json_decode("{}");
  $i = 0;
  foreach($row as $column){
    $results->$column = $i;
    $i++;
  }
  return $results;
}