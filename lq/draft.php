<?php
/* Start helper funstions */
function getHeader($data, $map){
  global $g;
  $results = json_decode("[]");
  foreach($data as $column){
    array_push($results, getMap($column, $map));
  }
  return $results;
}

function getMap($key, $map){
  global $g;
  return $g->mappings->$key->$map;
}

function getKeyNames($json){
  global $g;
  $results = json_decode("[]");
  foreach($json as $key => $value){
    array_push($results, $key);
  }
  return $results;
}

function clearWriteFlags(){
  global $g;
  $g->write_debug = false;
  $g->write_contact = false;
  $g->write_event = false;
  $g->write_supplement = false;
}

function resetWriteArrays(){
  global $g;
  $g->results_debug = json_decode("[]");
  $g->results_contact = json_decode("[]");
  $g->results_event = json_decode("[]");
  $g->results_supplement = json_decode("[]");
}

function checkHeader(){
  global $g;
  if($g->mappings_keys_count !== count($g->row)){
    exit_code('key counts in input file does not match mappings row count: ' . count($g->row));
  }
  foreach($g->row as $column){
    if(!isset($g->mappings->$column)){ // is the column in the mapping? 
      exit_code('key found in input file does not match mappings', $g);
    }
  }
}

function debugHeader(){
  global $g;
  $g->out_debug_handle = fopen($g->out_dir . $g->out_debug, "w");
  if($g->debug){
    foreach($g->mappings_keys as $header){
      $g->write_debug = true;
      $g->results_debug = getHeader($g->row, "map_debug");
    }
  }
}

function contactHeader(){
  global $g;
  // $g->out_contact_handle = fopen($g->out_dir . $g->out_contact, "w");
}

function eventHeader(){
  global $g;
  // $g->out_event_handle = fopen($g->out_dir . $g->out_event, "w");
}

function supplementHeader(){
  global $g;
  // $g->out_supplement_handle = fopen($g->out_dir . $g->out_supplement, "w");
}

function debugRow(){
  global $g;
  if($g->debug){
    $g->write_debug = true;
    foreach($g->row as $column){
      array_push($g->results_debug, trim($column));
    }
  } 
}

function contactRow(){
  global $g;
}

function eventRow(){
  global $g;
}

function supplementRow(){
  global $g;
}

function debugWrite(){
  global $g;
  if($g->write_debug){
    fputcsv($g->out_debug_handle, $g->results_debug);
  }
}

function contactWrite(){
  global $g;
  if($g->write_contact){
    fputcsv($g->out_contact_handle, $g->results_contact);
  }
}

function eventWrite(){
  global $g;
  if($g->write_event){
    fputcsv($g->out_event_handle, $g->results_event);
  }
}

function supplementWrite(){
  global $g;
  if($g->write_supplement){
    fputcsv($g->out_supplement_handle, $g->results_supplement);
  }
}

function closeFiles(){
  global $g;
  foreach($g as $key => $value){
    if (preg_match("/_handle$/", $key)){
      fclose($g->$key);
    }
  }
}

function exit_code($error){
  global $g;
  if(isset($error)){
    $g->error = $error;
  }
  if($g->debug === true){
    echo "<pre>";
    print_r($g);
    echo "</pre>";
  }
  exit();
}
/* End helper funstions */

/* Start Config Setup */
$g = json_decode("{}");
$g->debug = false;
$g->in_config_dir = "/var/github/shop/lq/";
$g->in_dir = "/var/lq/";
$g->out_dir = "/var/lq/";
$g->in_file = "20170531_trigger_first_100.csv";
$g->in_mapping_file = "mapping.json";
$g->out_debug = "20170531_trigger_first_100_debug.out";
$g->out_contact = "20170531_trigger_first_100_contact.out";
$g->out_event = "20170531_trigger_first_100_event.out";
$g->out_supplement = "20170531_trigger_first_100_supplement.out";
$g->in_handle = fopen($g->in_dir . $g->in_file, "r");
$g->have_read_header = false;
$g->mappings = json_decode(file_get_contents($g->in_config_dir . $g->in_mapping_file));
$g->mappings_keys = getKeyNames($g->mappings);
$g->mappings_keys_count = count($g->mappings_keys);

if(isset($_GET["debug"]) && $_GET["debug"] === "true"){
  $g->debug = true;
}
/* End Config Setup */

/* Start processing Rows */
while (($g->row = fgetcsv($g->in_handle)) !== false) {
  clearWriteFlags();
  resetWriteArrays();
  if(!$g->have_read_header){
    $g->have_read_header = true;
    checkHeader();
    debugHeader();
    contactHeader();
    eventHeader();
    supplementHeader();
  }else{
    debugRow();
    contactRow();
    eventRow();
    supplementRow();
  }
  debugWrite();
  contactWrite();
  eventWrite();
  supplementWrite();
}
/* End processing rows */

/* Start Cleanup and Send */
closeFiles();
exit_code(null);
/* End Cleanup and Send */
?>