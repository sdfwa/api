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
      $g->debug_header = getHeader($g->row, "map_debug");
      $g->results_debug = $g->debug_header;
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
      unset($g->$key);
    }
  }
}

function downloadSFTP(){
  global $g;
  $connection = ssh2_connect($g->creds->ftp_server, 22);
  ssh2_auth_password($connection, $g->creds->ftp_username, $g->creds->ftp_password);
  // array('hostkey'=>'ssh-rsa,ssh-dss')
  $sftp = ssh2_sftp($connection);
  $g->ftp_handle = fopen("ssh2.sftp://$sftp/".$g->in_server_file, 'r');
  $g->in_handle = fopen($g->in_file, "w");
  $writtenBytes = stream_copy_to_stream($g->ftp_handle, $g->in_handle);
  fclose($g->ftp_handle);
  unset($g->ftp_handle);
  fclose($g->in_handle);
  unset($g->in_handle);
}

function uploadSFTP(){
  global $g;
  $connection = ssh2_connect($g->creds->ftp_server, 22);
  ssh2_auth_password($connection, $g->creds->ftp_username, $g->creds->ftp_password);
  // array('hostkey'=>'ssh-rsa,ssh-dss')
  $sftp = ssh2_sftp($connection);
  $g->ftp_handle = fopen("ssh2.sftp://$sftp/".$g->out_server_file, 'w');
  $g->out_handle = fopen($g->out_dir . $g->out_debug, "r");
  $writtenBytes = stream_copy_to_stream($g->out_handle, $g->ftp_handle);
  fclose($g->ftp_handle);
  unset($g->ftp_handle);
  fclose($g->out_handle);
  unset($g->out_handle);
}

function contactImportsAPI(){
  global $g;
  $g->api_payload = json_decode("{}");
  $g->api_payload->source = json_decode("{}");
  $g->api_payload->source->transport = "sftp";
  $g->api_payload->source->server = $g->creds->ftp_server;
  $g->api_payload->source->path = "." . $g->out_server_file;
  $g->api_payload->source->port = "22";
  $g->api_payload->source->username = $g->creds->ftp_username;
  $g->api_payload->source->password = $g->creds->ftp_password;
  $g->api_payload->hasHeader = true;
  $g->api_payload->columns = $g->debug_header;
  $g->api_payload->delimiter = ",";
  // $g->api_payload->strategy = "updateOnly";
  $g->api_payload->suppressTriggers = true;
  $g->api_curl = curl_init();
  curl_setopt($g->api_curl, CURLOPT_POST, 1);
  curl_setopt($g->api_curl, CURLOPT_URL, "https://api.cordial.io/v1/contactimports");
  curl_setopt($g->api_curl, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($g->api_curl, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json",
    "Accept: application/json",
    "Authorization: Basic " . $g->creds->api_key
  ));
  $g->api_result = curl_exec($g->api_curl);
  curl_close($g->api_curl);
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
if(isset($_GET["debug"]) && $_GET["debug"] === "true"){
  $g->debug = true;
}else{
  $g->debug = false;
}
$g->out_dir = "/var/lq/";
// $g->in_server_file = "/incoming/Clairvoyix/20170531_trigger.csv";
$g->in_server_file = "/Trendline_Cordial/20170531_trigger_in.csv";
$g->out_server_file = "/Trendline_Cordial/20170531_trigger.csv";
$g->in_file = "/var/lq/20170531_trigger.csv";
$g->in_mapping_file = "/var/github/shop/lq/mapping.json";
$g->creds_file = "/var/lq/creds.json";
$g->out_debug = "20170531_trigger_first_100_debug.out";
$g->out_contact = "20170531_trigger_first_100_contact.out";
$g->out_event = "20170531_trigger_first_100_event.out";
$g->out_supplement = "20170531_trigger_first_100_supplement.out";
$g->have_read_header = false;
$g->creds = json_decode(file_get_contents($g->creds_file));
$g->mappings = json_decode(file_get_contents($g->in_mapping_file));
/* End Config Setup */

/* Start Before process Rows */

downloadSFTP();
$g->in_handle = fopen($g->in_file, "r");
$g->mappings_keys = getKeyNames($g->mappings);
$g->mappings_keys_count = count($g->mappings_keys);
/* End Before Process Rows */

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
uploadSFTP();
contactImportsAPI();
exit_code(null);
/* End Cleanup and Send */
?>