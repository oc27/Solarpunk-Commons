document.addEventListener("DOMContentLoaded", async () => {
 const client=window.supabaseClient, root=document.getElementById("topic-list"), msg=document.getElementById("research-message");
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 if(!client){root.textContent="Supabase is not configured. Check config.js.";return;}
 const [{data:{session}},{data:topics,error:topicError}]=await Promise.all([client.auth.getSession(),client.from("research_topics").select("id,slug,title,question,description,position").eq("is_open",true).order("position")]);
 if(topicError){root.textContent="Couldn't load research topics: "+topicError.message+". Have you run the research-topics-setup.sql file in Supabase?";return;}
 const user=session?.user||null;
 let own={};
 if(user){const {data,error}=await client.from("research_responses").select("id,topic_id,response,current_need,updated_at").eq("profile_id",user.id);if(error){msg.textContent="Couldn't load your saved answers: "+error.message;msg.className="error";}else (data||[]).forEach(r=>own[r.topic_id]=r);}
 const {data:responses,error:responseError}=await client.from("research_responses").select("id,topic_id,response,current_need,updated_at,profiles(name,location)").order("updated_at",{ascending:false});
 if(responseError) console.warn(responseError);
 function render(){
  root.innerHTML=(topics||[]).map((t,i)=>{const mine=own[t.id], entries=(responses||[]).filter(r=>r.topic_id===t.id);return `<article class="research-topic" id="topic-${esc(t.slug)}"><div class="topic-number">RESEARCH QUESTION / ${String(i+1).padStart(2,"0")} · ${entries.length} CONTRIBUTION${entries.length===1?"":"S"}</div><h2>${esc(t.title)}</h2><h3 class="research-question">${esc(t.question)}</h3><p class="topic-description">${esc(t.description)}</p>
  <div class="research-answers"><h3>Contributions from the commons</h3>${entries.length?entries.map(r=>`<article class="research-answer"><div class="answer-by"><strong>${esc(r.profiles?.name||"Commons member")}</strong><span>${esc(r.profiles?.location||"Location not shared")}</span></div>${r.current_need?`<p class="answer-status">${esc(r.current_need)}</p>`:""}<p>${esc(r.response).replace(/\n/g,"<br>")}</p></article>`).join(""):`<p class="muted">No contributions yet. Start the conversation.</p>`}</div>
  ${user?`<form class="research-form" data-topic="${t.id}"><h3>${mine?"Your contribution · edit or add to it":"Add your contribution"}</h3>${t.slug==="current-projects"?`<label>What best describes where you are right now?<select name="current_need"><option value="">Choose one (optional)</option>${["I have a project that needs collaborators","I have a project that needs resources or funding","I'd like to join an existing project","I have skills or resources I'd like to contribute","I'm looking for inspiration or connections","I'd like to start something but need help getting going"].map(x=>`<option ${mine?.current_need===x?"selected":""}>${esc(x)}</option>`).join("")}</select></label>`:""}<label>Your answer<textarea name="response" rows="5" maxlength="5000" required placeholder="Share examples, experiences, names, links or reflections…">${esc(mine?.response||"")}</textarea></label><button class="button" type="submit">${mine?"Update contribution ↗":"Submit contribution ↗"}</button><p class="save-message" role="status"></p></form>`:`<p class="sign-in-prompt"><a href="login.html?next=research-topics.html">Sign in</a> or <a href="register.html">create an account</a> to contribute. Your answers can be edited later from this page.</p>`}</article>`;}).join("");
  root.querySelectorAll(".research-form").forEach(form=>form.addEventListener("submit",save));
 }
 async function save(e){e.preventDefault();const form=e.currentTarget,button=form.querySelector("button"),status=form.querySelector(".save-message"),topicId=form.dataset.topic;button.disabled=true;button.textContent="Saving…";
  const payload={topic_id:topicId,profile_id:user.id,response:form.elements.response.value.trim(),current_need:form.elements.current_need?.value||null,updated_at:new Date().toISOString()};
  const {error}=await client.from("research_responses").upsert(payload,{onConflict:"topic_id,profile_id"});button.disabled=false;button.textContent=own[topicId]?"Update contribution ↗":"Submit contribution ↗";
  if(error){status.textContent="Couldn't save your contribution: "+error.message;status.className="error";return;}
  msg.textContent="Your contribution has been saved. You can return and edit it whenever you like.";msg.className="success";
  const {data}=await client.from("research_responses").select("id,topic_id,response,current_need,updated_at").eq("profile_id",user.id);own={};(data||[]).forEach(r=>own[r.topic_id]=r);
  const {data:all}=await client.from("research_responses").select("id,topic_id,response,current_need,updated_at,profiles(name,location)").order("updated_at",{ascending:false});responses.splice(0,responses.length,...(all||[]));render();
 }
 render();
});
