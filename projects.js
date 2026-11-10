document.addEventListener("DOMContentLoaded", async () => {
 const client=window.supabaseClient;
 const list=document.getElementById("projects-list"), count=document.getElementById("project-count");
 const editor=document.getElementById("project-editor"), form=document.getElementById("project-form");
 const message=document.getElementById("project-form-message"), showButton=document.getElementById("show-project-form");
 const cancelButton=document.getElementById("cancel-project"), saveButton=document.getElementById("save-project");
 if(!client){list.textContent="Supabase is not configured. Check config.js.";return;}
 const {data:{session}}=await client.auth.getSession();
 const user=session?.user||null;
 let projects=[], editingId=null;
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const openEditor=(project=null)=>{
  editingId=project?.id||null; form.reset();
  document.getElementById("editor-title").textContent=project?"Edit your project":"Share a project";
  saveButton.textContent=project?"Save changes ↗":"Publish project ↗";
  if(project){for(const key of ["name","location","details","participation"])form.elements[key].value=project[key]||"";}
  message.textContent="";message.className="";editor.hidden=false;editor.scrollIntoView({behavior:"smooth",block:"start"});
 };
 showButton.addEventListener("click",()=>{if(!user){window.location.href="login.html?next=projects.html";return;}openEditor();});
 cancelButton.addEventListener("click",()=>{editor.hidden=true;form.reset();editingId=null;});
 async function loadProjects(){
  const {data,error}=await client.from("projects").select("id,owner_id,name,location,details,participation,created_at,updated_at,profiles(name,location)").order("created_at",{ascending:false});
  if(error){list.innerHTML='<p class="error">Couldn\'t load projects: '+esc(error.message)+'. Check that you have run projects-setup.sql in Supabase.</p>';count.textContent="";return;}
  projects=data||[];count.textContent=projects.length+ (projects.length===1?" project in the Commons":" projects in the Commons");render();
 }
 function render(){
  if(!projects.length){list.innerHTML='<div class="empty-projects"><p class="eyebrow">A SPACE FOR WHAT IS NEXT</p><h2>Nothing growing here <em>yet.</em></h2><p>Know a project that needs collaborators, skills, space or support? Be the first to plant a seed.</p>'+(user?'<button class="button" id="empty-add-project" type="button">Share the first project ↗</button>':'<a class="button" href="register.html">Join and share a project ↗</a>')+'</div>';document.getElementById("empty-add-project")?.addEventListener("click",()=>openEditor());return;}
  list.innerHTML=projects.map(p=>'<article class="project-card"><div class="project-card-top"><span class="project-label">OPEN PROJECT</span>'+(user&&p.owner_id===user.id?'<span class="project-owner-tools"><button type="button" data-edit="'+p.id+'">Edit</button><button type="button" data-delete="'+p.id+'">Delete</button></span>':'')+'</div><h2>'+esc(p.name)+'</h2><p class="project-location">⌖ '+esc(p.location||"Location not specified")+'</p><div class="project-details">'+esc(p.details)+'</div><div class="project-participate"><h3>HOW TO PARTICIPATE</h3><p>'+esc(p.participation)+'</p></div><p class="project-byline">Shared by <strong>'+esc(p.profiles?.name||"Commons member")+'</strong>'+(p.profiles?.location?' · '+esc(p.profiles.location):'')+'</p></article>').join("");
  list.querySelectorAll("[data-edit]").forEach(b=>b.addEventListener("click",()=>openEditor(projects.find(p=>p.id===b.dataset.edit))));
  list.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",async()=>{const p=projects.find(x=>x.id===b.dataset.delete);if(!p||!confirm('Delete “'+p.name+'”? This cannot be undone.'))return;const {error}=await client.from("projects").delete().eq("id",p.id);if(error){alert("Couldn't delete project: "+error.message);return;}await loadProjects();}));
 }
 form.addEventListener("submit",async e=>{
  e.preventDefault();if(!user){window.location.href="login.html?next=projects.html";return;}
  saveButton.disabled=true;saveButton.textContent="Saving…";
  const payload={owner_id:user.id,name:form.elements.name.value.trim(),location:form.elements.location.value.trim()||null,details:form.elements.details.value.trim(),participation:form.elements.participation.value.trim(),updated_at:new Date().toISOString()};
  const result=editingId?await client.from("projects").update(payload).eq("id",editingId).eq("owner_id",user.id):await client.from("projects").insert(payload);
  saveButton.disabled=false;saveButton.textContent=editingId?"Save changes ↗":"Publish project ↗";
  if(result.error){message.textContent="Couldn't save your project: "+result.error.message;message.className="error";return;}
  message.textContent="Your project has been saved.";message.className="success";form.reset();editingId=null;editor.hidden=true;await loadProjects();
 });
 await loadProjects();
});
