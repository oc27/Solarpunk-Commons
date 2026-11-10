document.addEventListener("DOMContentLoaded", () => {
 const form=document.getElementById("login-form");
 const msg=document.getElementById("form-message");
 form.addEventListener("submit", async e => {
  e.preventDefault();
  if(!window.supabaseClient){msg.textContent="Supabase is not configured. Check config.js.";msg.className="error";return;}
  const button=form.querySelector("button");button.disabled=true;button.textContent="Signing in…";
  const {error}=await window.supabaseClient.auth.signInWithPassword({
   email:form.elements.email.value.trim(),
   password:form.elements.password.value
  });
  button.disabled=false;button.textContent="Sign in ↗";
  if(error){msg.textContent=error.message;msg.className="error";return;}
  window.location.href="profile.html";
 });
});