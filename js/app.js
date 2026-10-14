const KEY="psp_subjects";
let subjects=JSON.parse(localStorage.getItem(KEY))||[
{id:"1",name:"Web Development",code:"WD-101",color:"#0d6efd",notes:"Frontend development and UI practice."},
{id:"2",name:"Programming",code:"CS-102",color:"#6f42c1",notes:"Practice programming concepts."}
];
const modal=new bootstrap.Modal(document.getElementById("modal"));
const form=document.getElementById("form");
const subjectId=document.getElementById("id");
const subjectName=document.getElementById("name");
const subjectCode=document.getElementById("code");
const subjectColor=document.getElementById("color");
const subjectNotes=document.getElementById("notes");
const modalTitle=document.getElementById("modalTitle");
function save(){localStorage.setItem(KEY,JSON.stringify(subjects))}
function esc(v){return String(v).replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[x]))}
function render(){
document.getElementById("count").textContent=subjects.length;
document.getElementById("heroCount").textContent=subjects.length;
document.getElementById("empty").classList.toggle("d-none",subjects.length>0);
const grid=document.getElementById("grid"); grid.innerHTML="";
subjects.forEach(s=>{grid.innerHTML+=`<div class="col-md-6 col-lg-4"><article class="subject"><div class="accent" style="background:${s.color}"></div><div class="subject-body"><div class="code">${esc(s.code||"No code")}</div><h4 class="fw-bold mt-2">${esc(s.name)}</h4><p class="text-secondary small">${esc(s.notes||"No notes added.")}</p><div class="d-flex gap-2"><button class="btn btn-outline-secondary btn-sm flex-fill" onclick="view('${s.id}')">View</button><button class="btn btn-outline-primary btn-sm" onclick="edit('${s.id}')">Edit</button><button class="btn btn-outline-danger btn-sm" onclick="del('${s.id}')">Delete</button></div></div></article></div>`})
if (window.module3Ready) { renderTasks(); renderDashboard(); }
}
document.getElementById("addBtn").onclick=()=>{form.reset();subjectId.value="";subjectColor.value="#0d6efd";modalTitle.textContent="Add Subject";modal.show()};
form.onsubmit=e=>{e.preventDefault();let data={id:subjectId.value||Date.now().toString(),name:subjectName.value.trim(),code:subjectCode.value.trim(),color:subjectColor.value,notes:subjectNotes.value.trim()};if(!data.name)return;if(subjectId.value){subjects=subjects.map(s=>s.id===subjectId.value?data:s);tasks=tasks.map(t=>String(t.subjectId)===String(data.id)?{...t,subjectName:data.name}:t);saveTasks()}else subjects.push(data);save();render();modal.hide()};
function edit(x){let s=subjects.find(a=>a.id===x);subjectId.value=s.id;subjectName.value=s.name;subjectCode.value=s.code;subjectColor.value=s.color;subjectNotes.value=s.notes;modalTitle.textContent="Edit Subject";modal.show()}
function view(x){let s=subjects.find(a=>a.id===x);alert(`Subject: ${s.name}\nCode: ${s.code||"Not added"}\nNotes: ${s.notes||"No notes added."}`)}
function del(x){let s=subjects.find(a=>a.id===x);if(!s)return;const linked=tasks.filter(t=>String(t.subjectId)===String(x)).length;const message=linked?`Delete "${s.name}" and its ${linked} linked task(s)?`:`Delete "${s.name}"?`;if(confirm(message)){subjects=subjects.filter(a=>String(a.id)!==String(x));tasks=tasks.filter(t=>String(t.subjectId)!==String(x));save();saveTasks();render()}}
// Module 2 - Study Task Management
const TASK_KEY = "psp_tasks";
let tasks = JSON.parse(localStorage.getItem(TASK_KEY)) || [];
let taskFilter = "all";
const taskModal = new bootstrap.Modal(document.getElementById("taskModal"));

function saveTasks() {
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

function subjectOptions(selected = "") {
    const select = document.getElementById("taskSubject");
    select.innerHTML = '<option value="">Select subject</option>';
    subjects.forEach(s => {
        const option = document.createElement("option");
        option.value = s.id;
        option.textContent = s.name;
        if (String(s.id) === String(selected)) option.selected = true;
        select.appendChild(option);
    });
}

document.getElementById("addTaskBtn").onclick = () => {
    if (!subjects.length) {
        alert("Please add a subject before creating a study task.");
        document.getElementById("subjects").scrollIntoView({behavior:"smooth"});
        return;
    }
    document.getElementById("taskForm").reset();
    document.getElementById("taskId").value = "";
    document.getElementById("taskStatus").value = "pending";
    document.getElementById("taskModalTitle").textContent = "Add Study Task";
    subjectOptions();
    taskModal.show();
};

function subjectExists(id) {
    return subjects.some(subject => String(subject.id) === String(id));
}

document.getElementById("taskForm").onsubmit = e => {
    e.preventDefault();

    const id = document.getElementById("taskId").value;
    const title = document.getElementById("taskTitle").value.trim();
    const subjectId = document.getElementById("taskSubject").value;
    const deadline = document.getElementById("taskDeadline").value;
    const status = document.getElementById("taskStatus").value;

    if (!title || !subjectId || !deadline) {
        document.getElementById("taskForm").reportValidity();
        return;
    }
    if (!subjectExists(subjectId)) {
        alert("Please select a valid subject. Add a subject first if needed.");
        return;
    }

    const subject = subjects.find(s => String(s.id) === String(subjectId));
    const data = {
        id: id || Date.now().toString(),
        title,
        subjectId,
        subjectName: subject ? subject.name : "Subject",
        deadline,
        status
    };

    if (id) {
        tasks = tasks.map(t => t.id === id ? data : t);
    } else {
        tasks.push(data);
    }

    saveTasks();
    renderTasks();
    taskModal.hide();
};

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById("taskId").value = task.id;
    document.getElementById("taskTitle").value = task.title;
    subjectOptions(task.subjectId);
    document.getElementById("taskDeadline").value = task.deadline;
    document.getElementById("taskStatus").value = task.status;
    document.getElementById("taskModalTitle").textContent = "Edit Study Task";
    taskModal.show();
}

function deleteTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task && confirm(`Delete "${task.title}"?`)) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
}

function toggleTask(id) {
    tasks = tasks.map(t => {
        if (t.id === id) t.status = t.status === "completed" ? "pending" : "completed";
        return t;
    });
    saveTasks();
    renderTasks();
}

document.querySelectorAll(".task-filter").forEach(button => {
    button.onclick = () => {
        document.querySelectorAll(".task-filter").forEach(b => {
            b.classList.remove("active", "btn-primary");
            b.classList.add("btn-outline-primary");
        });
        button.classList.add("active", "btn-primary");
        button.classList.remove("btn-outline-primary");
        taskFilter = button.dataset.filter;
        renderTasks();
    };
});

function renderTasks() {
    const grid = document.getElementById("taskGrid");
    const empty = document.getElementById("taskEmpty");

    document.getElementById("taskCount").textContent = tasks.length;
    document.getElementById("pendingCount").textContent = tasks.filter(t => t.status === "pending").length;
    document.getElementById("completedCount").textContent = tasks.filter(t => t.status === "completed").length;

    let list = tasks;
    if (taskFilter === "pending") list = tasks.filter(t => t.status === "pending");
    if (taskFilter === "completed") list = tasks.filter(t => t.status === "completed");

    list = [...list].sort((a, b) => a.deadline.localeCompare(b.deadline));
    empty.classList.toggle("d-none", list.length > 0);
    grid.innerHTML = "";

    list.forEach(t => {
        grid.innerHTML += `
        <div class="col-md-6 col-lg-4">
            <article class="task ${t.status === "completed" ? "completed" : ""}">
                <div class="task-body">
                    <div class="d-flex justify-content-between gap-2 align-items-start">
                        <h5 class="fw-bold mb-1">${esc(t.title)}</h5>
                        <span class="task-status ${t.status}">${t.status === "completed" ? "Completed" : "Pending"}</span>
                    </div>
                    <p class="text-secondary small mb-2">📚 ${esc(t.subjectName)}</p>
                    <div class="task-date mb-3">📅 Deadline: ${formatTaskDate(t.deadline)}</div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm ${t.status === "completed" ? "btn-warning" : "btn-success"}" onclick="toggleTask('${t.id}')">
                            ${t.status === "completed" ? "Mark Pending" : "Mark Complete"}
                        </button>
                        <button class="btn btn-outline-primary btn-sm" onclick="editTask('${t.id}')">Edit</button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteTask('${t.id}')">Delete</button>
                    </div>
                </div>
            </article>
        </div>`;
    });
    if (window.module3Ready) renderDashboard();
    if (window.module4Ready) renderModule4();
}

function formatTaskDate(value) {
    return new Date(value + "T00:00:00").toLocaleDateString(undefined, {
        day: "2-digit", month: "short", year: "numeric"
    });
}

renderTasks();


// Module 3 — Interactive Dashboard and Progress Tracking
let m3Chart = null;
let m3Filter = "all";
function m3Escape(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
}
function m3Date(value) {
    if (!value) return "No deadline";
    const d = new Date(value + (String(value).length === 10 ? "T00:00:00" : ""));
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(undefined, {day:"2-digit", month:"short", year:"numeric"});
}
function m3Overdue(task) {
    if (task.status === "completed" || !task.deadline) return false;
    const d = new Date(task.deadline + "T00:00:00");
    const today = new Date(); today.setHours(0,0,0,0);
    return !Number.isNaN(d.getTime()) && d < today;
}
function renderDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const pending = total - completed;
    const percent = total ? Math.round(completed / total * 100) : 0;
    document.getElementById("m3Total").textContent = total;
    document.getElementById("m3Completed").textContent = completed;
    document.getElementById("m3Pending").textContent = pending;
    document.getElementById("m3Percent").textContent = percent;
    document.getElementById("m3ProgressBar").style.width = percent + "%";
    document.getElementById("m3ChartDone").textContent = completed;
    document.getElementById("m3ChartPending").textContent = pending;
    document.getElementById("m3SubjectCount").textContent = `${subjects.length} subject${subjects.length === 1 ? "" : "s"}`;

    const canvas = document.getElementById("m3TaskChart");
    if (typeof Chart !== "undefined") {
        if (m3Chart) m3Chart.destroy();
        m3Chart = new Chart(canvas, {
            type: "doughnut",
            data: { labels: ["Completed", "Pending"], datasets: [{data:[completed,pending], backgroundColor:["#6558d3","#ffb75e"], borderColor:"#fff", borderWidth:4, hoverOffset:6}] },
            options: { responsive:true, maintainAspectRatio:false, cutout:"68%", plugins:{legend:{display:false}} }
        });
    } else {
        canvas.parentElement.innerHTML = '<p class="text-secondary small text-center py-5">Chart library could not load. Check your internet connection.</p>';
    }

    const subjectRoot = document.getElementById("m3SubjectProgress");
    if (!subjects.length) {
        subjectRoot.innerHTML = '<div class="text-secondary small py-4 text-center">Add subjects and tasks to see progress.</div>';
    } else {
        subjectRoot.innerHTML = subjects.map(s => {
            const related = tasks.filter(t => String(t.subjectId) === String(s.id));
            const done = related.filter(t => t.status === "completed").length;
            const pct = related.length ? Math.round(done / related.length * 100) : 0;
            return `<div class="m3-subject-row">
                <div class="m3-subject-info"><strong>${m3Escape(s.name)}</strong><small>${done} of ${related.length} tasks</small></div>
                <div class="m3-subject-track" role="progressbar" aria-label="${m3Escape(s.name)} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><div style="width:${pct}%;background:${m3Escape(s.color || "#6558d3")}"></div></div>
                <strong class="m3-subject-pct">${pct}%</strong>
            </div>`;
        }).join("");
    }

    const filtered = tasks.filter(t => m3Filter === "all" || t.status === m3Filter)
        .slice().sort((a,b) => String(b.deadline || "").localeCompare(String(a.deadline || ""))).slice(0,12);
    const tbody = document.getElementById("m3TaskRows");
    if (!filtered.length) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-secondary py-4">${total ? "No tasks match this filter." : "No tasks yet. Add tasks in the Module 2 section above."}</td></tr>`;
    } else {
        tbody.innerHTML = filtered.map(t => {
            const subject = subjects.find(s => String(s.id) === String(t.subjectId));
            const isDone = t.status === "completed";
            return `<tr><td><strong>${m3Escape(t.title)}</strong>${m3Overdue(t) ? '<div class="m3-overdue">Past deadline</div>' : ''}</td>
            <td>${m3Escape(subject ? subject.name : (t.subjectName || "Unknown subject"))}</td>
            <td>${m3Escape(m3Date(t.deadline))}</td>
            <td><span class="m3-status ${isDone ? "is-done" : "is-pending"}">${isDone ? "Completed" : "Pending"}</span></td></tr>`;
        }).join("");
    }
}
document.getElementById("m3TaskFilter").addEventListener("change", e => {
    m3Filter = e.target.value;
    renderDashboard();
});
window.module3Ready = true;
render();
renderTasks();
renderDashboard();


// Module 4 — Smart study priorities, search, filters, and upcoming deadlines
function m4Escape(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
}
function m4Today() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}
function m4Date(value) {
    if (!value) return "No deadline";
    const d = new Date(value + "T00:00:00");
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(undefined, {day:"2-digit", month:"short", year:"numeric"});
}
function m4DayDifference(value) {
    if (!value) return null;
    const d = new Date(value + "T00:00:00");
    if (Number.isNaN(d.getTime())) return null;
    return Math.round((d.getTime() - m4Today().getTime()) / 86400000);
}
function m4Priority(task) {
    if (task.status === "completed") return "Completed";
    const days = m4DayDifference(task.deadline);
    if (days !== null && days < 0) return "Overdue";
    if (days !== null && days <= 2) return "High";
    if (days !== null && days <= 7) return "Medium";
    return "Normal";
}
function renderModule4() {
    const pending = tasks.filter(t => t.status === "pending");
    const overdue = pending.filter(t => {
        const days = m4DayDifference(t.deadline);
        return days !== null && days < 0;
    });
    const upcoming = pending.filter(t => {
        const days = m4DayDifference(t.deadline);
        return days !== null && days >= 0 && days <= 7;
    });

    document.getElementById("m4PendingTasks").textContent = pending.length;
    document.getElementById("m4UpcomingTasks").textContent = upcoming.length;
    document.getElementById("m4OverdueTasks").textContent = overdue.length;

    const subjectStats = subjects.map(s => {
        const related = pending.filter(t => String(t.subjectId) === String(s.id));
        const urgent = related.filter(t => {
            const days = m4DayDifference(t.deadline);
            return days !== null && days <= 2;
        }).length;
        return {subject:s, count:related.length, urgent, next:related.map(t => t.deadline).filter(Boolean).sort()[0] || ""};
    }).filter(x => x.count > 0).sort((a,b) => b.count - a.count || b.urgent - a.urgent || String(a.next).localeCompare(String(b.next)));
    document.getElementById("m4PrioritySubjects").textContent = subjectStats.length;

    const recommendationRoot = document.getElementById("m4Recommendations");
    if (!subjectStats.length) {
        recommendationRoot.innerHTML = '<div class="col-12 text-center text-secondary py-4">No pending work right now. Add a task or enjoy your progress!</div>';
    } else {
        recommendationRoot.innerHTML = subjectStats.map((x, i) => `
          <div class="col-md-6 col-xl-4">
            <div class="m4-recommendation h-100">
              <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                <span class="m4-rank">Priority ${i + 1}</span>
                <span class="badge ${x.urgent ? "text-bg-danger" : "text-bg-primary"}">${x.urgent ? "Urgent" : "Focus"}</span>
              </div>
              <h5 class="fw-bold">${m4Escape(x.subject.name)}</h5>
              <p class="text-secondary small mb-2">${x.count} pending task${x.count === 1 ? "" : "s"}${x.urgent ? ` · ${x.urgent} due within 2 days or overdue` : ""}</p>
              <div class="small text-secondary mb-3">${x.next ? `Next deadline: ${m4Date(x.next)}` : "No deadline set"}</div>
              <button class="btn btn-sm btn-outline-primary" type="button" onclick="m4FocusSubject('${m4Escape(x.subject.id)}')">View subject tasks</button>
            </div>
          </div>`).join("");
    }

    const subjectSelect = document.getElementById("m4Subject");
    const oldSubject = subjectSelect.value || "all";
    subjectSelect.innerHTML = '<option value="all">All subjects</option>' + subjects.map(s =>
        `<option value="${m4Escape(s.id)}">${m4Escape(s.name)}</option>`).join("");
    if ([...subjectSelect.options].some(o => o.value === oldSubject)) subjectSelect.value = oldSubject;

    const search = (document.getElementById("m4Search").value || "").trim().toLowerCase();
    const status = document.getElementById("m4Status").value;
    const selectedSubject = subjectSelect.value;
    const filtered = tasks.filter(t => {
        const s = subjects.find(item => String(item.id) === String(t.subjectId));
        const subjectName = s ? s.name : (t.subjectName || "");
        const matchesSearch = !search || String(t.title || "").toLowerCase().includes(search) || subjectName.toLowerCase().includes(search);
        const matchesStatus = status === "all" || t.status === status;
        const matchesSubject = selectedSubject === "all" || String(t.subjectId) === selectedSubject;
        return matchesSearch && matchesStatus && matchesSubject;
    }).slice().sort((a,b) => {
        const da = String(a.deadline || "9999-99-99"), db = String(b.deadline || "9999-99-99");
        return da.localeCompare(db);
    });
    const taskRows = document.getElementById("m4TaskRows");
    if (!filtered.length) {
        taskRows.innerHTML = `<tr><td colspan="5" class="text-center text-secondary py-4">${tasks.length ? "No tasks match your search or filters." : "No tasks yet. Add a task in the Study Tasks section."}</td></tr>`;
    } else {
        taskRows.innerHTML = filtered.map(t => {
            const s = subjects.find(item => String(item.id) === String(t.subjectId));
            const priority = m4Priority(t);
            const badge = priority === "Overdue" || priority === "High" ? "text-bg-danger" : priority === "Medium" ? "text-bg-warning" : priority === "Completed" ? "text-bg-success" : "text-bg-light";
            return `<tr>
              <td><strong>${m4Escape(t.title)}</strong></td>
              <td>${m4Escape(s ? s.name : (t.subjectName || "Unknown subject"))}</td>
              <td>${m4Escape(m4Date(t.deadline))}</td>
              <td><span class="m3-status ${t.status === "completed" ? "is-done" : "is-pending"}">${t.status === "completed" ? "Completed" : "Pending"}</span></td>
              <td><span class="badge ${badge}">${priority}</span></td>
            </tr>`;
        }).join("");
    }
    document.getElementById("m4ResultCount").textContent = `Showing ${filtered.length} of ${tasks.length} task${tasks.length === 1 ? "" : "s"}`;

    const upcomingRoot = document.getElementById("m4UpcomingList");
    const upcomingSorted = upcoming.slice().sort((a,b) => String(a.deadline).localeCompare(String(b.deadline)));
    if (!upcomingSorted.length) {
        upcomingRoot.innerHTML = '<div class="col-12 text-center text-secondary py-4">No pending tasks due in the next 7 days.</div>';
    } else {
        upcomingRoot.innerHTML = upcomingSorted.map(t => {
            const s = subjects.find(item => String(item.id) === String(t.subjectId));
            const days = m4DayDifference(t.deadline);
            const dueLabel = days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `Due in ${days} days`;
            return `<div class="col-md-6 col-lg-4"><div class="m4-upcoming-card h-100">
              <div class="d-flex justify-content-between gap-2 align-items-start"><h6 class="fw-bold">${m4Escape(t.title)}</h6><span class="badge ${days <= 1 ? "text-bg-danger" : "text-bg-primary"}">${dueLabel}</span></div>
              <p class="text-secondary small mb-1">${m4Escape(s ? s.name : (t.subjectName || "Unknown subject"))}</p>
              <div class="small">📅 ${m4Escape(m4Date(t.deadline))}</div>
            </div></div>`;
        }).join("");
    }
}
function m4FocusSubject(id) {
    document.getElementById("m4Subject").value = String(id);
    document.getElementById("m4Status").value = "pending";
    document.getElementById("smart-priority").scrollIntoView({behavior:"smooth", block:"start"});
    renderModule4();
}
["m4Search", "m4Status", "m4Subject"].forEach(id => {
    document.getElementById(id).addEventListener(id === "m4Search" ? "input" : "change", renderModule4);
});
window.module4Ready = true;
renderModule4();
