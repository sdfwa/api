// todos = [{member_id:5455}];
// todo = {};
// localStorage.setItem('todo', JSON.stringify(todo));
// localStorage.setItem('todos', JSON.stringify(todos));
function store_local(t){
  localStorage.setItem('todo', JSON.stringify(t));
}
todo = JSON.parse((localStorage.getItem('todo') || '{}'));
if(typeof todo.member_id === 'number'){
  switch(true){
    case todo.step === 'Assign A Pass':
      this_step = todo.step;
      todo.step = 'Pick Pass';
      store_local(todo);
      $('a:contains("'+this_step+'")')[0].click();
      break;
    case todo.step === 'Pick Pass':
      todo.step = 'Select Pass';
      store_local(todo);
      // $($('select')[0]).val(21783);
      $($('select')[0]).val(21784);
      $($('select')[1]).val('Other');
      $('#pass_payment_received').click();
      $('#pass_note').val('founder');
      $('input[name=commit]')[0].click();
      break;
    case todo.step === 'Select Pass':
      // this_step = 'Gold + Init';
      this_step = 'Silver + Init';
      todo.step = 'Edit Pass';
      store_local(todo);
      $('a:contains("'+this_step+'")')[0].click();
      break;
    case todo.step === 'Edit Pass':
      this_step = todo.step;
      todo.step = 'expire';
      store_local(todo);
      $('a:contains("'+this_step+'")')[0].click();
      break;
    case todo.step === 'expire':
      this_step = todo.step;
      todo.step = 'https://app.punchpass.net/customers';
      store_local(todo);
      $('a[data-target="#change_expiration"]')[0].click();
      $('#pass_expires_at_2i').val(6);
      $('#pass_expires_at_3i').val(1);
      $('input[name=commit]')[0].click();
      break;
    case todo.step === 'https://app.punchpass.net/customers':
      this_step = todo.step;
      store_local({});
      document.location = this_step;
      break;
  }
}else{
  todos = JSON.parse((localStorage.getItem('todos') || '[]'));
  if(todos.length > 0){
    todo = todos.pop();
    todo.step = 'Assign A Pass';
    store_local(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
    $('a:contains("'+('0000'+todo.member_id).substr(-4)+'")')[0].click();
  }
}