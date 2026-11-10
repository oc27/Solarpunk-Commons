document.addEventListener("DOMContentLoaded", async () => {
 const client=window.supabaseClient, form=document.getElementById("profile-form");
 const msg=document.getElementById("form-message"), signOut=document.getElementById("sign-out");
 if(!client){msg.textContent="Supabase is not configured. Check config.js.";msg.className="error";return;}
 const {data:{session},error:sessionError}=await client.auth.getSession();
 if(sessionError || !session){
  window.location.href="login.html?next=profile.html";return;
 }
 const user=session.user;
 const {data:profile,error}=await client.from("profiles").select("name,location,introduction,interests,contribution").eq("id",user.id).maybeSingle();
 if(error){msg.textContent="Couldn't load your profile: "+error.message;msg.className="error";return;}
 if(profile){
  for(const key of ["name","location","introduction","contribution"]) form.elements[key].value=profile[key]||"";
  const selected=profile.interests||[];
  form.querySelectorAll('input[name="interests"]').forEach(box=>box.checked=selected.includes(box.value));
 } else {
  form.elements.name.value=user.user_metadata?.name||"";
  msg.textContent="Your profile hasn't appeared yet. Try refreshing in a moment, or contact the site administrator.";
 }
 form.addEventListener("submit",async e=>{
  e.preventDefault();
  const button=form.querySelector("button");button.disabled=true;button.textContent="Saving…";
  const payload={
   id:user.id,
   name:form.elements.name.value.trim(),
   location:form.elements.location.value.trim()||null,
   introduction:form.elements.introduction.value.trim()||null,
   interests:[...form.querySelectorAll('input[name="interests"]:checked')].map(x=>x.value),
   contribution:form.elements.contribution.value.trim()||null
  };
  const {error:saveError}=await client.from("profiles").update(payload).eq("id",user.id);
  button.disabled=false;button.textContent="Save profile ↗";
  if(saveError){msg.textContent="Couldn't save your profile: "+saveError.message;msg.className="error";return;}
  msg.textContent="Your profile has been updated.";msg.className="success";
 });
 signOut.addEventListener("click",async()=>{
  await client.auth.signOut();window.location.href="index.html";
 });
});