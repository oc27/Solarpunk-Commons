document.addEventListener('DOMContentLoaded',async()=>{
 const db=window.supabaseClient;if(!db)return;
 const {data,error}=await db.from('profile_field_settings').select('field_key,label,help_text,is_visible');if(error)return;
 const forms=[document.getElementById('profile-form'),document.getElementById('register-form')].filter(Boolean);
 (data||[]).forEach(field=>forms.forEach(form=>{
  let target;
  if(field.field_key==='interests')target=form.querySelector('fieldset');
  else target=form.querySelector(`[name="${field.field_key}"]`)?.closest('label');
  if(!target)return;
  target.hidden=!field.is_visible;
  if(field.field_key==='interests'){const legend=target.querySelector('legend');if(legend)legend.textContent=field.label;const help=target.querySelector('small');if(help&&field.help_text)help.textContent=field.help_text;}
  else {const first=[...target.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());if(first)first.textContent=field.label;const small=target.querySelector('small');if(small&&field.help_text)small.textContent=field.help_text;}
 }));
});
