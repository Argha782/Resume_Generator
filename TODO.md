# TODO: Fix Resume Creation and Upload Issues

## Client-Side Fixes (Dashboard.jsx)
- [x] Fix API call for uploadResume: change '/api/ai/upload-resume' to '/api/ai/resumes/create'
- [x] Fix API call for loadAllResumes: change POST to GET for '/api/users/resumes'
- [x] Bind title input in create form: add value={title} and onChange={(e) => setTitle(e.target.value)}
- [x] Bind title input in upload form: add value={title} and onChange={(e) => setTitle(e.target.value)}
- [x] Bind title input in edit form: add value={title} and onChange={(e) => setTitle(e.target.value)}
- [x] Fix deleteResume confirmation logic: change if (confirm) return; to if (!confirm) return;
- [x] Fix loadAllResumes setState: change setAllResumes(data.resumes, dummyResumeData); to setAllResumes(data.resumes);

## Server-Side Fixes
### ai.controller.js
- [x] Fix userID access: change req.user.id to req.userID
- [x] Fix Resume.create field: change {user: userID} to {userID}

### resume.controller.js
- [x] Fix getResumeById: change req.body.resumeId to req.params.resumeId
- [x] Fix updateResume: change req.body.resumeId to req.params.resumeId
- [x] Fix deleteResume: change req.body.resumeId to req.params.resumeId
- [x] Fix getPublicResumeById: change req.body.resumeId to req.params.resumeId

## Testing
- [ ] Test resume creation functionality
- [ ] Test resume upload functionality
- [ ] Ensure server is running and database connected
