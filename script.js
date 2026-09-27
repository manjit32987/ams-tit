/**
 * TIT ACADEMIC ATTENDANCE MANAGEMENT SYSTEM (AMS)
 * Pure Vanilla JavaScript Client-Side Engine
 * 
 * Features:
 * 1. Firebase Ready: Full Firebase Authentication & Cloud Firestore sync support
 * 2. Multi-Role Auth (Principal, Approved/Pending Teachers, Students)
 * 3. Principal Approval Engine for Teacher Registrations
 * 4. Teacher & Principal Subject Creation with Student Join Request Workflow
 * 5. Daily Attendance Marking with Bulk Toggles & Live Counters
 * 6. One-Click Excel Sheet (.CSV) and Printable Official PDF Reports
 * 7. Separate Academic Holidays & Campus Calendar with Countdown
 * 8. Separate Subject Study Resources Repository
 * 9. Persistent Store with Real Accounts (All demo passwords removed)
 * 10. Clean Executive Light Theme with Theme Toggle
 */

// ============================================================================
// 1. DATA STORE & INITIAL SEEDING
// ============================================================================

const STORAGE_KEYS = {
  USERS: 'tit_ams_users_v4',
  SUBJECTS: 'tit_ams_subjects_v4',
  JOIN_REQUESTS: 'tit_ams_join_requests_v4',
  ATTENDANCE: 'tit_ams_attendance_v4',
  HOLIDAYS: 'tit_ams_holidays_v4',
  RESOURCES: 'tit_ams_resources_v4',
  CURRENT_USER: 'tit_ams_current_user_v4'
};

// Default institution structure (NO hardcoded demo passwords!)
const DEFAULT_SEED_DATA = {
  users: [
    {
      id: 'user_principal_1',
      name: 'Dr. S. K. Mukherjee',
      email: 'principal@institution.edu',
      role: 'principal',
      designation: 'Principal Sir / Super Admin',
      status: 'approved',
      avatar: 'P'
    },
    {
      id: 'teacher_1',
      name: 'Prof. Anita Sharma',
      email: 'prof.sharma@institution.edu',
      role: 'teacher',
      teacherId: 'FAC-CSE-101',
      department: 'Computer Science & Engineering',
      status: 'approved',
      avatar: 'AS'
    },
    {
      id: 'teacher_2',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@institution.edu',
      role: 'teacher',
      teacherId: 'FAC-IT-102',
      department: 'Information Technology',
      status: 'approved',
      avatar: 'RK'
    },
    {
      id: 'teacher_3',
      name: 'Dr. Vikram Verma',
      email: 'dr.verma@institution.edu',
      role: 'teacher',
      teacherId: 'FAC-ECE-105',
      department: 'Electronics & Communication',
      status: 'pending', // Pending Principal Approval!
      avatar: 'VV',
      registeredAt: '2024-09-26'
    },
    {
      id: 'student_1',
      name: 'Rahul Sharma',
      email: 'rahul.cse@institution.edu',
      role: 'student',
      rollNo: 'CSE-2024-042',
      semester: 'Semester 5 (3rd Year)',
      department: 'Computer Science & Engineering',
      status: 'approved',
      avatar: 'RS'
    },
    {
      id: 'student_2',
      name: 'Priya Patel',
      email: 'priya.patel@institution.edu',
      role: 'student',
      rollNo: 'CSE-2024-055',
      semester: 'Semester 5 (3rd Year)',
      department: 'Computer Science & Engineering',
      status: 'approved',
      avatar: 'PP'
    },
    {
      id: 'student_3',
      name: 'Amit Verma',
      email: 'amit.verma@institution.edu',
      role: 'student',
      rollNo: 'IT-2024-019',
      semester: 'Semester 5 (3rd Year)',
      department: 'Information Technology',
      status: 'approved',
      avatar: 'AV'
    }
  ],

  subjects: [
    {
      id: 'sub_1',
      code: 'CS-501',
      title: 'Database Management Systems',
      teacherId: 'teacher_1',
      teacherName: 'Prof. Anita Sharma',
      department: 'Computer Science & Engineering',
      semester: 'Semester 5',
      desc: 'Relational database models, SQL optimization, indexing, ACID transactions, and normalization.'
    },
    {
      id: 'sub_2',
      code: 'CS-502',
      title: 'Design & Analysis of Algorithms',
      teacherId: 'teacher_1',
      teacherName: 'Prof. Anita Sharma',
      department: 'Computer Science & Engineering',
      semester: 'Semester 5',
      desc: 'Algorithm complexity, Divide-and-Conquer, Dynamic Programming, Greedy approaches, and Graph theory.'
    },
    {
      id: 'sub_3',
      code: 'IT-503',
      title: 'Operating Systems',
      teacherId: 'teacher_2',
      teacherName: 'Dr. Rajesh Kumar',
      department: 'Information Technology',
      semester: 'Semester 5',
      desc: 'Process concurrency, CPU scheduling algorithms, virtual memory paging, and deadlock mitigation.'
    }
  ],

  joinRequests: [
    {
      id: 'req_1',
      studentId: 'student_1',
      studentName: 'Rahul Sharma',
      studentRoll: 'CSE-2024-042',
      studentDept: 'Computer Science & Engineering',
      studentSemester: 'Semester 5',
      subjectId: 'sub_1',
      subjectName: 'Database Management Systems',
      subjectCode: 'CS-501',
      teacherId: 'teacher_1',
      status: 'accepted',
      requestedAt: '2024-09-10'
    },
    {
      id: 'req_2',
      studentId: 'student_1',
      studentName: 'Rahul Sharma',
      studentRoll: 'CSE-2024-042',
      studentDept: 'Computer Science & Engineering',
      studentSemester: 'Semester 5',
      subjectId: 'sub_2',
      subjectName: 'Design & Analysis of Algorithms',
      subjectCode: 'CS-502',
      teacherId: 'teacher_1',
      status: 'accepted',
      requestedAt: '2024-09-11'
    },
    {
      id: 'req_3',
      studentId: 'student_2',
      studentName: 'Priya Patel',
      studentRoll: 'CSE-2024-055',
      studentDept: 'Computer Science & Engineering',
      studentSemester: 'Semester 5',
      subjectId: 'sub_1',
      subjectName: 'Database Management Systems',
      subjectCode: 'CS-501',
      teacherId: 'teacher_1',
      status: 'accepted',
      requestedAt: '2024-09-12'
    },
    {
      id: 'req_4',
      studentId: 'student_3',
      studentName: 'Amit Verma',
      studentRoll: 'IT-2024-019',
      studentDept: 'Information Technology',
      studentSemester: 'Semester 5',
      subjectId: 'sub_3',
      subjectName: 'Operating Systems',
      subjectCode: 'IT-503',
      teacherId: 'teacher_2',
      status: 'accepted',
      requestedAt: '2024-09-12'
    },
    {
      id: 'req_5',
      studentId: 'student_3',
      studentName: 'Amit Verma',
      studentRoll: 'IT-2024-019',
      studentDept: 'Information Technology',
      studentSemester: 'Semester 5',
      subjectId: 'sub_1',
      subjectName: 'Database Management Systems',
      subjectCode: 'CS-501',
      teacherId: 'teacher_1',
      status: 'pending',
      requestedAt: '2024-09-26'
    }
  ],

  attendance: [
    {
      id: 'att_1',
      subjectId: 'sub_1',
      date: '2024-09-16',
      teacherId: 'teacher_1',
      teacherName: 'Prof. Anita Sharma',
      records: [
        { studentId: 'student_1', rollNo: 'CSE-2024-042', name: 'Rahul Sharma', status: 'present', remarks: 'Good interaction' },
        { studentId: 'student_2', rollNo: 'CSE-2024-055', name: 'Priya Patel', status: 'present', remarks: '' }
      ]
    },
    {
      id: 'att_2',
      subjectId: 'sub_1',
      date: '2024-09-18',
      teacherId: 'teacher_1',
      teacherName: 'Prof. Anita Sharma',
      records: [
        { studentId: 'student_1', rollNo: 'CSE-2024-042', name: 'Rahul Sharma', status: 'present', remarks: '' },
        { studentId: 'student_2', rollNo: 'CSE-2024-055', name: 'Priya Patel', status: 'absent', remarks: 'Medical leave' }
      ]
    },
    {
      id: 'att_3',
      subjectId: 'sub_1',
      date: '2024-09-20',
      teacherId: 'teacher_1',
      teacherName: 'Prof. Anita Sharma',
      records: [
        { studentId: 'student_1', rollNo: 'CSE-2024-042', name: 'Rahul Sharma', status: 'present', remarks: '' },
        { studentId: 'student_2', rollNo: 'CSE-2024-055', name: 'Priya Patel', status: 'present', remarks: '' }
      ]
    },
    {
      id: 'att_4',
      subjectId: 'sub_1',
      date: '2024-09-23',
      teacherId: 'teacher_1',
      teacherName: 'Prof. Anita Sharma',
      records: [
        { studentId: 'student_1', rollNo: 'CSE-2024-042', name: 'Rahul Sharma', status: 'present', remarks: '' },
        { studentId: 'student_2', rollNo: 'CSE-2024-055', name: 'Priya Patel', status: 'present', remarks: '' }
      ]
    }
  ],

  holidays: [
    { id: 'hol_1', title: 'Gandhi Jayanti', date: '2024-10-02', type: 'National', desc: 'Birth anniversary of Mahatma Gandhi. Institute will remain closed.' },
    { id: 'hol_2', title: 'Maha Navami / Dussehra', date: '2024-10-12', type: 'Festival', desc: 'Vijayadashami festive break for students and faculty.' },
    { id: 'hol_3', title: 'Diwali & Govardhan Puja', date: '2024-11-01', type: 'Festival', desc: 'Festival of Lights institutional recess.' },
    { id: 'hol_4', title: 'Mid-Term Examinations', date: '2024-11-18', type: 'Academic', desc: 'Odd Semester Mid-Term Theory and Practical examinations commence.' },
    { id: 'hol_5', title: 'Winter Vacation', date: '2024-12-25', type: 'Academic', desc: 'Year-end academic break and Christmas holiday.' },
    { id: 'hol_6', title: 'Republic Day', date: '2025-01-26', type: 'National', desc: 'National flag hoisting ceremony at main campus.' }
  ],

  resources: [
    {
      id: 'res_1',
      title: 'DBMS Unit 1: Relational Model & SQL Query Optimization Notes',
      subjectId: 'sub_1',
      subjectName: 'Database Management Systems',
      subjectCode: 'CS-501',
      type: 'Lecture Notes',
      link: 'https://example.com/notes/dbms-unit-1.pdf',
      teacherName: 'Prof. Anita Sharma',
      notes: 'Detailed handwritten and digital notes covering ER models, normal forms 1NF to BCNF, and indexing.'
    },
    {
      id: 'res_2',
      title: 'DAA Dynamic Programming Master Cheatsheet & Code Snippets',
      subjectId: 'sub_2',
      subjectName: 'Design & Analysis of Algorithms',
      subjectCode: 'CS-502',
      type: 'Reference Link',
      link: 'https://example.com/daa/dp-cheatsheet.html',
      teacherName: 'Prof. Anita Sharma',
      notes: 'Includes Knapsack, LCS, Matrix Chain Multiplication recurrence relations and complexity breakdowns.'
    },
    {
      id: 'res_3',
      title: 'Operating Systems Process Scheduling & Deadlock Slides',
      subjectId: 'sub_3',
      subjectName: 'Operating Systems',
      subjectCode: 'IT-503',
      type: 'Presentation',
      link: 'https://example.com/slides/os-scheduling.pptx',
      teacherName: 'Dr. Rajesh Kumar',
      notes: 'Class presentation with solved numericals on Round Robin, SJF, and Banker algorithm.'
    }
  ]
};

// Data Store wrapper
const AMS = {
  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
  },
  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getSubjects() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS)) || [];
  },
  saveSubjects(subs) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subs));
  },

  getJoinRequests() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOIN_REQUESTS)) || [];
  },
  saveJoinRequests(reqs) {
    localStorage.setItem(STORAGE_KEYS.JOIN_REQUESTS, JSON.stringify(reqs));
  },

  getAttendance() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || [];
  },
  saveAttendance(att) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(att));
  },

  getHolidays() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HOLIDAYS)) || [];
  },
  saveHolidays(hols) {
    localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(hols));
  },

  getResources() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESOURCES)) || [];
  },
  saveResources(res) {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(res));
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
  },
  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  initializeSeedData(forceReset = false) {
    if (forceReset || !localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_SEED_DATA.users));
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(DEFAULT_SEED_DATA.subjects));
      localStorage.setItem(STORAGE_KEYS.JOIN_REQUESTS, JSON.stringify(DEFAULT_SEED_DATA.joinRequests));
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(DEFAULT_SEED_DATA.attendance));
      localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(DEFAULT_SEED_DATA.holidays));
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(DEFAULT_SEED_DATA.resources));
    }
  }
};

// Initialize seed data on script load
AMS.initializeSeedData(false);

// App state variables
let currentAuthMode = 'login'; // 'login' | 'register'
let currentLoginRole = 'principal'; // 'principal' | 'teacher' | 'student'
let currentRegisterType = 'teacher'; // 'teacher' | 'student'
let activeAppSection = 'dashboard'; // 'dashboard' | 'holidays' | 'resources'
let currentTeacherSelectedSubjectId = null;
let currentTeacherSelectedDate = new Date().toISOString().split('T')[0];

// ============================================================================
// 2. TOAST NOTIFICATION SYSTEM
// ============================================================================

function showToast(title, message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-xmark',
    warning: 'fa-solid fa-triangle-exclamation',
    info: 'fa-solid fa-circle-info'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="${icons[type] || icons.info}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <button type="button" class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================================
// 3. AUTHENTICATION & REGISTRATION (FIREBASE INTEGRATED)
// ============================================================================

function switchAuthMode(mode) {
  currentAuthMode = mode;
  const loginSection = document.getElementById('loginSection');
  const registerSection = document.getElementById('registerSection');
  const tabBtnLogin = document.getElementById('tabBtnLogin');
  const tabBtnRegister = document.getElementById('tabBtnRegister');

  if (mode === 'login') {
    loginSection.style.display = 'block';
    registerSection.style.display = 'none';
    tabBtnLogin.classList.add('active');
    tabBtnRegister.classList.remove('active');
  } else {
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    tabBtnLogin.classList.remove('active');
    tabBtnRegister.classList.add('active');
    switchRegisterType(currentRegisterType);
  }
}

function updateLoginRole(role) {
  currentLoginRole = role;

  ['Principal', 'Teacher', 'Student'].forEach(r => {
    const lbl = document.getElementById(`roleLabel${r}`);
    if (lbl) {
      if (r.toLowerCase() === role.toLowerCase()) {
        lbl.classList.add('active');
      } else {
        lbl.classList.remove('active');
      }
    }
  });

  const hint = document.getElementById('loginRoleHint');
  const emailInput = document.getElementById('loginEmail');
  if (role === 'principal') {
    if (hint) hint.innerHTML = 'Role: <strong>Principal (Super Admin)</strong>';
    if (emailInput && !emailInput.value) emailInput.placeholder = 'e.g. principal@institution.edu';
  } else if (role === 'teacher') {
    if (hint) hint.innerHTML = 'Role: <strong>Faculty / Teacher</strong>';
    if (emailInput && !emailInput.value) emailInput.placeholder = 'e.g. prof.sharma@institution.edu';
  } else {
    if (hint) hint.innerHTML = 'Role: <strong>Enrolled Student</strong>';
    if (emailInput && !emailInput.value) emailInput.placeholder = 'e.g. rahul.cse@institution.edu';
  }
}

// Academic Program & Department Mapping for Tripura Institute of Technology
const TIT_PROGRAM_DATA = {
  'Diploma': {
    label: 'Diploma (Polytechnic - 3 Years)',
    departments: [
      { value: 'Architectural Assistantship (Diploma)', text: 'Architectural Assistantship' },
      { value: 'Automobile Engineering (Diploma)', text: 'Automobile Engineering' },
      { value: 'Civil Engineering (Diploma)', text: 'Civil Engineering' },
      { value: 'Computer Science & Technology (Diploma)', text: 'Computer Science & Technology' },
      { value: 'Electrical Engineering (Diploma)', text: 'Electrical Engineering' },
      { value: 'Electronics & Telecommunication Engineering (Diploma)', text: 'Electronics & Telecommunication Engg' },
      { value: 'Food Processing Technology (Diploma)', text: 'Food Processing Technology' },
      { value: 'Mechanical Engineering (Diploma)', text: 'Mechanical Engineering' }
    ],
    semesters: [
      'Semester 1 (1st Year)',
      'Semester 2 (1st Year)',
      'Semester 3 (2nd Year)',
      'Semester 4 (2nd Year)',
      'Semester 5 (3rd Year)',
      'Semester 6 (3rd Year)'
    ]
  },
  'Degree': {
    label: 'Degree (B.Tech - 4 Years)',
    departments: [
      { value: 'Civil Engineering (Degree)', text: 'Civil Engineering' },
      { value: 'Computer Science & Engineering (Degree)', text: 'Computer Science & Engineering' },
      { value: 'Electrical Engineering (Degree)', text: 'Electrical Engineering' },
      { value: 'Electronics & Communication Engineering (Degree)', text: 'Electronics & Communication Engg' },
      { value: 'Mechanical Engineering (Degree)', text: 'Mechanical Engineering' }
    ],
    semesters: [
      'Semester 1 (1st Year)',
      'Semester 2 (1st Year)',
      'Semester 3 (2nd Year)',
      'Semester 4 (2nd Year)',
      'Semester 5 (3rd Year)',
      'Semester 6 (3rd Year)',
      'Semester 7 (4th Year)',
      'Semester 8 (4th Year)'
    ]
  },
  'M.Tech': {
    label: 'M.Tech (Postgraduate - 2 Years)',
    departments: [
      { value: 'M. Tech in Data Science', text: 'M. Tech in Data Science' },
      { value: 'M. Tech in Thermal Engineering', text: 'M. Tech in Thermal Engineering' },
      { value: 'M. Tech in VLSI & Embedded Systems', text: 'M. Tech in VLSI & Embedded Systems' },
      { value: 'M. Tech in Power & Energy System', text: 'M. Tech in Power & Energy System' }
    ],
    semesters: [
      'Semester 1 (1st Year)',
      'Semester 2 (1st Year)',
      'Semester 3 (2nd Year)',
      'Semester 4 (2nd Year)'
    ]
  }
};

function onStudentProgramChange() {
  const progSelect = document.getElementById('regStudentProgram');
  const deptSelect = document.getElementById('regStudentDept');
  const semSelect = document.getElementById('regStudentSemester');
  if (!progSelect || !deptSelect || !semSelect) return;

  const selectedProgram = progSelect.value || 'Degree';
  const progInfo = TIT_PROGRAM_DATA[selectedProgram] || TIT_PROGRAM_DATA['Degree'];

  const currentDeptVal = deptSelect.value;
  deptSelect.innerHTML = `<option value="" disabled ${!currentDeptVal ? 'selected' : ''}>-- Select ${selectedProgram} Branch --</option>` +
    progInfo.departments.map(d => `<option value="${d.value}" ${d.value === currentDeptVal ? 'selected' : ''}>${d.text}</option>`).join('');

  if (!deptSelect.value && progInfo.departments.length > 0) {
    deptSelect.selectedIndex = 1;
  }

  semSelect.innerHTML = progInfo.semesters.map((sem, idx) =>
    `<option value="${sem}" ${idx === 0 ? 'selected' : ''}>${sem}</option>`
  ).join('');
}

function switchRegisterType(type) {
  currentRegisterType = type;
  const btnTeacher = document.getElementById('regTypeTeacherBtn');
  const btnStudent = document.getElementById('regTypeStudentBtn');
  const teacherFields = document.getElementById('teacherFields');
  const studentFields = document.getElementById('studentFields');
  const alertBanner = document.getElementById('teacherApprovalAlert');
  const submitText = document.getElementById('regSubmitBtnText');

  if (type === 'teacher') {
    btnTeacher.classList.add('active');
    btnStudent.classList.remove('active');
    teacherFields.style.display = 'block';
    studentFields.style.display = 'none';
    alertBanner.style.display = 'flex';
    submitText.textContent = 'Submit Teacher Registration (Principal Approval Required)';
  } else {
    btnTeacher.classList.remove('active');
    btnStudent.classList.add('active');
    teacherFields.style.display = 'none';
    studentFields.style.display = 'block';
    alertBanner.style.display = 'none';
    submitText.textContent = 'Register Student Account';
    onStudentProgramChange();
  }
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  const icon = btn.querySelector('i');
  if (icon) {
    icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
  }
}

// Handle Login (Supports Firebase Auth or Local Verified Accounts)
async function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const role = currentLoginRole;

  if (!email || !password) {
    showToast('Input Required', 'Please enter your email and password.', 'warning');
    return;
  }

  // 1. FIREBASE AUTHENTICATION MODE
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && firebaseAuthInstance) {
    try {
      showToast('Authenticating', 'Connecting to Firebase Authentication...', 'info', 2000);
      const userCredential = await firebaseAuthInstance.signInWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;

      // Fetch profile from Firestore
      let userProfile = null;
      if (firestoreDbInstance) {
        try {
          const doc = await firestoreDbInstance.collection('users').doc(uid).get();
          if (doc.exists) {
            userProfile = doc.data();
          }
        } catch (dbErr) {
          console.warn('Firestore profile fetch notice (Check Security Rules):', dbErr.message);
        }
      }

      if (!userProfile) {
        // Fallback to local stored user
        const localUsers = AMS.getUsers();
        userProfile = localUsers.find(u => u.email.toLowerCase() === email) || {
          id: uid,
          name: userCredential.user.displayName || email.split('@')[0],
          email: email,
          role: role,
          status: 'approved'
        };
      }

      // Check role
      if (userProfile.role !== role) {
        showToast('Role Notice', `Signed in as ${userProfile.role.toUpperCase()}.`, 'info');
        updateLoginRole(userProfile.role);
      }

      // Check Teacher Approval by Principal Sir!
      if (userProfile.role === 'teacher' && userProfile.status !== 'approved') {
        await firebaseAuthInstance.signOut();
        showToast(
          'Approval Required by Principal Sir',
          `Dear ${userProfile.name}, your faculty account is currently PENDING approval by Principal Sir. Please contact the Principal's Office.`,
          'warning',
          6000
        );
        return;
      }

      AMS.setCurrentUser(userProfile);
      showToast('Welcome!', `Logged in successfully via Firebase as ${userProfile.name}`, 'success');
      initAppShell();
      return;
    } catch (fbErr) {
      console.warn('Firebase login attempt:', fbErr);
      let errMsg = fbErr.message;
      if (fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/user-not-found') {
        errMsg = 'Invalid email or password. Please verify your credentials or click "Forgot Password?".';
      } else if (fbErr.code === 'auth/too-many-requests') {
        errMsg = 'Too many attempts. Access is temporarily disabled; please try again later or reset password.';
      }
      showToast('Login Failed (Firebase)', errMsg, 'error', 6000);
      return;
    }
  }

  // 2. LOCAL FALLBACK MODE (When Firebase keys not yet configured)
  const users = AMS.getUsers();
  const user = users.find(u => u.email.toLowerCase() === email);

  if (!user) {
    showToast('Account Not Found', 'No account found with this email. Please register first.', 'error');
    return;
  }

  // Check role match
  if (user.role !== role) {
    showToast('Role Switched', `This account belongs to ${user.role.toUpperCase()} role.`, 'info');
    updateLoginRole(user.role);
    const radio = document.querySelector(`input[name="loginRole"][value="${user.role}"]`);
    if (radio) radio.checked = true;
  }

  // Check Teacher Approval Verification by Principal Sir!
  if (user.role === 'teacher' && user.status !== 'approved') {
    showToast(
      'Approval Required by Principal Sir',
      `Dear ${user.name}, your faculty registration is currently PENDING approval by Principal Sir. Please contact the Principal's Office or log in as Principal to approve.`,
      'warning',
      6000
    );
    return;
  }

  // Successful login
  AMS.setCurrentUser(user);
  showToast('Welcome!', `Logged in successfully as ${user.name} (${user.role.toUpperCase()})`, 'success');
  initAppShell();
}

// Handle Forgot Password via Firebase Auth
async function handleForgotPassword() {
  const emailInput = document.getElementById('loginEmail');
  const email = (emailInput ? emailInput.value : '').trim().toLowerCase();
  if (!email) {
    showToast(
      'Email Required',
      'Please enter your email address into the Email field above, then click "Forgot Password?".',
      'warning',
      5000
    );
    if (emailInput) emailInput.focus();
    return;
  }
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && firebaseAuthInstance) {
    try {
      showToast('Sending Reset Email', `Contacting Firebase for ${email}...`, 'info', 2000);
      await firebaseAuthInstance.sendPasswordResetEmail(email);
      showToast(
        'Password Reset Email Sent!',
        `A password reset link was sent to ${email}. Check your inbox or spam folder.`,
        'success',
        7000
      );
    } catch (err) {
      console.warn('Password reset error:', err);
      let msg = err.message;
      if (err.code === 'auth/user-not-found') {
        msg = `No account found for "${email}". Please register an account first.`;
      }
      showToast('Password Reset Notice', msg, 'error', 6000);
    }
  } else {
    showToast('Local Mode', 'Firebase is currently running in offline mock mode.', 'info', 4000);
  }
}

// Handle Registration (Creates Firebase Auth user & Firestore profile, or local store)
async function handleRegisterSubmit(event) {
  event.preventDefault();

  const fullName = document.getElementById('regFullName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;

  if (!fullName || !email || !password) {
    showToast('Missing Fields', 'Please complete all required fields.', 'warning');
    return;
  }

  if (password.length < 6) {
    showToast('Weak Password', 'Password must be at least 6 characters.', 'warning');
    return;
  }

  if (password !== confirmPassword) {
    showToast('Password Mismatch', 'The passwords entered do not match.', 'error');
    return;
  }

  const users = AMS.getUsers();
  if (users.some(u => u.email.toLowerCase() === email)) {
    showToast('Email Already Registered', 'An account with this email address already exists. Please sign in.', 'warning');
    return;
  }

  // Extract role specific fields
  let teacherId = '';
  let department = '';
  let rollNo = '';
  let semester = '';
  let program = '';

  if (currentRegisterType === 'teacher') {
    teacherId = document.getElementById('regTeacherId').value.trim() || `FAC-${Date.now().toString().slice(-4)}`;
    department = document.getElementById('regTeacherDept').value;
  } else {
    rollNo = document.getElementById('regStudentRoll').value.trim();
    program = document.getElementById('regStudentProgram')?.value || 'Degree';
    semester = document.getElementById('regStudentSemester').value;
    department = document.getElementById('regStudentDept').value;

    if (!department) {
      showToast('Department Required', 'Please select your academic branch / department.', 'warning');
      return;
    }

    if (!rollNo) {
      showToast('Roll Number Required', 'Please provide your university roll number.', 'warning');
      return;
    }
  }

  const avatar = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // 1. FIREBASE REGISTRATION
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && firebaseAuthInstance) {
    try {
      showToast('Registering', 'Creating account in Firebase Authentication...', 'info', 2000);
      const userCredential = await firebaseAuthInstance.createUserWithEmailAndPassword(email, password);
      const fbUid = userCredential.user.uid;

      const newProfile = {
        id: fbUid,
        uid: fbUid,
        name: fullName,
        email: email,
        role: currentRegisterType,
        status: currentRegisterType === 'teacher' ? 'pending' : 'approved',
        registeredAt: new Date().toISOString().split('T')[0],
        avatar: avatar
      };

      if (currentRegisterType === 'teacher') {
        newProfile.teacherId = teacherId;
        newProfile.department = department;
      } else {
        newProfile.program = program;
        newProfile.rollNo = rollNo;
        newProfile.semester = semester;
        newProfile.department = department;
      }

      // Store in Cloud Firestore
      let firestoreProfileSaved = false;
      if (firestoreDbInstance) {
        try {
          await firestoreDbInstance.collection('users').doc(fbUid).set(newProfile);
          firestoreProfileSaved = true;
        } catch (dbErr) {
          console.warn('Firestore user profile save notice:', dbErr.message);
          showToast(
            'Firestore Rules Need Update',
            'Account created in Auth! However, Cloud Firestore write was denied. Please paste the security rules in Firebase Console.',
            'warning',
            7000
          );
        }
      }

      // Store locally
      const existingUserIdx = users.findIndex(u => u.email.toLowerCase() === email || u.id === fbUid);
      if (existingUserIdx >= 0) {
        users[existingUserIdx] = newProfile;
      } else {
        users.push(newProfile);
      }
      AMS.saveUsers(users);

      if (currentRegisterType === 'teacher') {
        showToast(
          'Teacher Registration Submitted (Firebase)',
          `Account created for ${fullName}. Pending verification by Principal Sir in Firestore.`,
          'info',
          7000
        );
      } else {
        showToast(
          'Student Registration Successful (Firebase)',
          `Welcome, ${fullName}! Your student profile has been registered in Firebase.`,
          'success',
          6000
        );
      }

      switchAuthMode('login');
      document.getElementById('loginEmail').value = email;
      document.getElementById('registerForm').reset();
      return;
    } catch (fbErr) {
      console.warn('Firebase registration attempt:', fbErr);
      if (fbErr.code === 'auth/email-already-in-use') {
        showToast(
          'Email Already Registered',
          `The email "${email}" is already registered. Redirecting you to Sign In so you can log in.`,
          'warning',
          6000
        );
        switchAuthMode('login');
        const loginEmailInput = document.getElementById('loginEmail');
        if (loginEmailInput) loginEmailInput.value = email;
        const pwdInput = document.getElementById('loginPassword');
        if (pwdInput) {
          pwdInput.value = '';
          pwdInput.focus();
        }
        return;
      } else if (fbErr.code === 'auth/weak-password') {
        showToast('Weak Password', 'Password must be at least 6 characters long.', 'warning', 5000);
        return;
      } else if (fbErr.code === 'auth/invalid-email') {
        showToast('Invalid Email', 'Please provide a valid email format.', 'warning', 5000);
        return;
      }
      showToast('Firebase Registration Error', fbErr.message, 'error', 6000);
      return;
    }
  }

  // 2. LOCAL REGISTRATION (When Firebase keys not yet added)
  const newAccount = {
    id: `${currentRegisterType}_${Date.now()}`,
    name: fullName,
    email: email,
    role: currentRegisterType,
    status: currentRegisterType === 'teacher' ? 'pending' : 'approved',
    registeredAt: new Date().toISOString().split('T')[0],
    avatar: avatar
  };

  if (currentRegisterType === 'teacher') {
    newAccount.teacherId = teacherId;
    newAccount.department = department;

    users.push(newAccount);
    AMS.saveUsers(users);

    showToast(
      'Teacher Registration Submitted',
      `Account created for ${fullName}. As per institution rules, you can log in once PRINCIPAL SIR approves your registration.`,
      'info',
      7000
    );
  } else {
    newAccount.program = program;
    newAccount.rollNo = rollNo;
    newAccount.semester = semester;
    newAccount.department = department;

    users.push(newAccount);
    AMS.saveUsers(users);

    showToast(
      'Student Registration Successful!',
      `Welcome, ${fullName}! Your student profile is active. You can now sign in and send join requests for subjects.`,
      'success',
      6000
    );
  }

  switchAuthMode('login');
  document.getElementById('loginEmail').value = email;
  document.getElementById('registerForm').reset();
}

async function handleLogout() {
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && firebaseAuthInstance) {
    try {
      await firebaseAuthInstance.signOut();
    } catch (e) {
      console.warn('Firebase signout:', e);
    }
  }

  AMS.setCurrentUser(null);
  document.getElementById('appShell').style.display = 'none';
  document.getElementById('authView').style.display = 'flex';
  showToast('Logged Out', 'You have been signed out safely.', 'info');
}

// ============================================================================
// 4. APPLICATION SHELL & DASHBOARD CONTROLLER
// ============================================================================

function initAppShell() {
  const user = AMS.getCurrentUser();
  if (!user) {
    document.getElementById('authView').style.display = 'flex';
    document.getElementById('appShell').style.display = 'none';
    return;
  }

  document.getElementById('authView').style.display = 'none';
  document.getElementById('appShell').style.display = 'flex';

  // Update Topbar
  document.getElementById('navUserName').textContent = user.name;
  document.getElementById('navUserAvatar').textContent = user.avatar || user.name.charAt(0);
  const roleBadge = document.getElementById('navRoleBadge');
  const roleSubtext = document.getElementById('navUserSubtext');

  if (user.role === 'principal') {
    roleBadge.textContent = 'Principal / Super Admin';
    roleSubtext.textContent = 'Principal Sir';
  } else if (user.role === 'teacher') {
    roleBadge.textContent = 'Faculty Member';
    roleSubtext.textContent = user.department || 'Teaching Faculty';
  } else {
    roleBadge.textContent = user.program ? `${user.program} Student` : 'Student';
    roleSubtext.textContent = `${user.rollNo || ''} • ${user.semester || ''}`;
  }

  // Update Sidebar Counts
  document.getElementById('sidebarHolidayCount').textContent = AMS.getHolidays().length;
  document.getElementById('sidebarResourceCount').textContent = AMS.getResources().length;

  // Build Sidebar Links
  buildSidebarLinks(user);

  // Navigate to default dashboard view
  navigateAppSection('dashboard');
}

function buildSidebarLinks(user) {
  const list = document.getElementById('sidebarLinksList');
  list.innerHTML = '';

  const addLink = (id, icon, label, onClick, badge = null, isActive = false) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="javascript:void(0)" class="nav-item ${isActive ? 'active' : ''}" id="${id}" onclick="${onClick}">
        <i class="${icon}"></i>
        <span>${label}</span>
        ${badge !== null ? `<span class="badge-count">${badge}</span>` : ''}
      </a>
    `;
    list.appendChild(li);
  };

  if (user.role === 'principal') {
    const pendingCount = AMS.getUsers().filter(u => u.role === 'teacher' && u.status === 'pending').length;
    addLink('sidePrinOverview', 'fa-solid fa-gauge-high', 'Administration Desk', "navigateAppSection('dashboard')", null, true);
    addLink('sidePrinApprovals', 'fa-solid fa-user-shield', 'Teacher Approvals', "scrollToSection('sectionTeacherApprovals')", pendingCount);
    addLink('sidePrinCourses', 'fa-solid fa-book-bookmark', 'All Subjects & Courses', "scrollToSection('sectionPrincipalCourses')");
  } else if (user.role === 'teacher') {
    const pendingRequests = AMS.getJoinRequests().filter(r => r.teacherId === user.id && r.status === 'pending').length;
    addLink('sideTeacherOverview', 'fa-solid fa-chalkboard-user', 'My Teaching Desk', "navigateAppSection('dashboard')", null, true);
    addLink('sideTeacherSubjects', 'fa-solid fa-layer-group', 'My Subjects', "openCreateSubjectModal()");
    addLink('sideTeacherRequests', 'fa-solid fa-user-plus', 'Join Requests', "scrollToSection('teacherJoinRequestsCard')", pendingRequests);
  } else {
    addLink('sideStudentOverview', 'fa-solid fa-graduation-cap', 'My Attendance Desk', "navigateAppSection('dashboard')", null, true);
    addLink('sideStudentBrowse', 'fa-solid fa-paper-plane', 'Browse & Join Subjects', "openBrowseSubjectsModal()");
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('appSidebar');
  sidebar.classList.toggle('open');
}

function scrollToSection(sectionId) {
  navigateAppSection('dashboard');
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.style.boxShadow = '0 0 25px rgba(79, 70, 229, 0.4)';
    setTimeout(() => {
      el.style.boxShadow = '';
    }, 2000);
  }
}

function navigateAppSection(section) {
  activeAppSection = section;
  const user = AMS.getCurrentUser();
  if (!user) return;

  const viewPrincipal = document.getElementById('viewPrincipal');
  const viewTeacher = document.getElementById('viewTeacher');
  const viewStudent = document.getElementById('viewStudent');
  const viewHolidays = document.getElementById('viewHolidays');
  const viewResources = document.getElementById('viewResources');

  [viewPrincipal, viewTeacher, viewStudent, viewHolidays, viewResources].forEach(v => {
    if (v) v.style.display = 'none';
  });

  document.querySelectorAll('.app-sidebar .nav-item').forEach(item => item.classList.remove('active'));

  if (section === 'holidays') {
    viewHolidays.style.display = 'block';
    document.getElementById('sideLinkHolidays')?.classList.add('active');
    renderAcademicHolidaysView(user);
  } else if (section === 'resources') {
    viewResources.style.display = 'block';
    document.getElementById('sideLinkResources')?.classList.add('active');
    renderResourcesView(user);
  } else {
    if (user.role === 'principal') {
      viewPrincipal.style.display = 'block';
      document.getElementById('sidePrinOverview')?.classList.add('active');
      renderPrincipalDashboard();
    } else if (user.role === 'teacher') {
      viewTeacher.style.display = 'block';
      document.getElementById('sideTeacherOverview')?.classList.add('active');
      renderTeacherDashboard(user);
    } else {
      viewStudent.style.display = 'block';
      document.getElementById('sideStudentOverview')?.classList.add('active');
      renderStudentDashboard(user);
    }
  }

  const sidebar = document.getElementById('appSidebar');
  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
  }
}

// ============================================================================
// 5. PRINCIPAL WORKSPACE & TEACHER APPROVAL ENGINE
// ============================================================================

function renderPrincipalDashboard() {
  const users = AMS.getUsers();
  const subjects = AMS.getSubjects();
  const students = users.filter(u => u.role === 'student');
  const teachers = users.filter(u => u.role === 'teacher');
  const pendingTeachers = teachers.filter(t => t.status === 'pending');
  const approvedTeachers = teachers.filter(t => t.status === 'approved');

  // KPIs
  document.getElementById('prinKpiPendingTeachers').textContent = pendingTeachers.length;
  document.getElementById('prinKpiApprovedTeachers').textContent = approvedTeachers.length;
  document.getElementById('prinKpiTotalStudents').textContent = students.length;
  document.getElementById('prinKpiTotalSubjects').textContent = subjects.length;

  const pendingBadge = document.getElementById('prinPendingBadge');
  if (pendingTeachers.length > 0) {
    pendingBadge.textContent = `${pendingTeachers.length} Action Needed`;
    pendingBadge.className = 'kpi-hint status-alert';
  } else {
    pendingBadge.textContent = 'All Verified';
    pendingBadge.className = 'kpi-hint';
  }

  // Pending Teachers Table (Principal Sir Approval Engine)
  const tbodyPending = document.getElementById('tbodyPendingTeachers');
  const counterPending = document.getElementById('pendingTeacherCounter');
  counterPending.textContent = `${pendingTeachers.length} Pending Approval`;

  if (pendingTeachers.length === 0) {
    tbodyPending.innerHTML = `
      <tr>
        <td colspan="7" class="text-center" style="padding: 30px; color: var(--text-muted);">
          <i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 1.5rem; margin-bottom: 6px; display:block;"></i>
          No teacher registrations are pending verification. All faculty registrations are verified!
        </td>
      </tr>
    `;
  } else {
    tbodyPending.innerHTML = pendingTeachers.map(teacher => `
      <tr>
        <td><strong>${teacher.name}</strong></td>
        <td><code>${teacher.teacherId || 'N/A'}</code></td>
        <td>${teacher.department || 'N/A'}</td>
        <td>${teacher.email}</td>
        <td>${teacher.registeredAt || 'Recent'}</td>
        <td><span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Pending Approval</span></td>
        <td class="text-right">
          <button type="button" class="btn btn-sm btn-outline-success" onclick="approveTeacherRegistration('${teacher.id}')" title="Approve Teacher to allow login">
            <i class="fa-solid fa-check"></i> Approve
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="rejectTeacherRegistration('${teacher.id}')" title="Reject / Dismiss">
            <i class="fa-solid fa-xmark"></i> Reject
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Approved Faculty Roster
  const tbodyApproved = document.getElementById('tbodyApprovedTeachersList');
  tbodyApproved.innerHTML = approvedTeachers.map(teacher => {
    const teacherSubjects = subjects.filter(s => s.teacherId === teacher.id);
    return `
      <tr>
        <td>
          <strong>${teacher.name}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${teacher.email}</div>
        </td>
        <td>${teacher.department || 'Academic Dept'}</td>
        <td><span class="badge badge-info">${teacherSubjects.length} Courses</span></td>
        <td><span class="badge badge-success"><i class="fa-solid fa-check"></i> Approved</span></td>
      </tr>
    `;
  }).join('');

  // Attendance Highlights
  const attHighlights = document.getElementById('prinAttendanceHighlights');
  const allAtt = AMS.getAttendance();
  if (subjects.length === 0) {
    attHighlights.innerHTML = '<p class="text-muted">No courses created yet.</p>';
  } else {
    attHighlights.innerHTML = subjects.map(sub => {
      const subAtt = allAtt.filter(a => a.subjectId === sub.id);
      const totalSessions = subAtt.length;
      let totalPresents = 0;
      let totalMarks = 0;

      subAtt.forEach(sess => {
        sess.records.forEach(r => {
          totalMarks++;
          if (r.status === 'present') totalPresents++;
        });
      });

      const avgPct = totalMarks > 0 ? Math.round((totalPresents / totalMarks) * 100) : 0;
      const progressColor = avgPct >= 75 ? 'var(--success)' : avgPct >= 60 ? 'var(--warning)' : 'var(--danger)';

      return `
        <div style="margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; font-size: 0.86rem; margin-bottom: 4px;">
            <span><strong>${sub.code}:</strong> ${sub.title}</span>
            <span style="font-weight: 700; color: ${progressColor};">${avgPct}% Avg Attendance</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.76rem; color: var(--text-muted); margin-bottom: 6px;">
            <span>Faculty: ${sub.teacherName}</span>
            <span>${totalSessions} Classes Conducted</span>
          </div>
          <div style="height: 6px; background: var(--bg-subtle); border-radius: 4px; overflow: hidden;">
            <div style="width: ${avgPct}%; height: 100%; background: ${progressColor}; border-radius: 4px;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // All Institutional Courses Management Table
  renderPrincipalAllSubjectsTable();
}

function renderPrincipalAllSubjectsTable() {
  const tbody = document.getElementById('tbodyPrincipalAllSubjects');
  if (!tbody) return;

  const subjects = AMS.getSubjects();
  const joinRequests = AMS.getJoinRequests();

  if (subjects.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center" style="padding: 24px; color: var(--text-muted);">
          No subjects created yet. Click "Create Subject" to add your first course.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = subjects.map(sub => {
    const enrolled = joinRequests.filter(r => r.subjectId === sub.id && r.status === 'accepted').length;
    return `
      <tr>
        <td><span class="sub-code-badge">${sub.code}</span></td>
        <td><strong>${sub.title}</strong></td>
        <td>
          <i class="fa-solid fa-chalkboard-user" style="color: var(--primary); margin-right: 4px;"></i>
          ${sub.teacherName}
        </td>
        <td>${sub.department}</td>
        <td><span class="badge badge-info">${sub.semester}</span></td>
        <td><strong>${enrolled}</strong> Students Enrolled</td>
        <td class="text-right">
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteSubjectAsPrincipal('${sub.id}')" title="Delete Course">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function deleteSubjectAsPrincipal(subjectId) {
  const subjects = AMS.getSubjects();
  const sub = subjects.find(s => s.id === subjectId);
  if (!confirm(`Are you sure you want to remove the subject "${sub?.title || 'this course'}"?`)) return;

  const updatedSubjects = subjects.filter(s => s.id !== subjectId);
  AMS.saveSubjects(updatedSubjects);

  // Sync with Firestore if active
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && firestoreDbInstance) {
    firestoreDbInstance.collection('subjects').doc(subjectId).delete().catch(console.warn);
  }

  showToast('Subject Removed', `Course ${sub?.code || ''} removed from institutional curriculum.`, 'info');
  renderPrincipalDashboard();
}

async function approveTeacherRegistration(teacherId) {
  // Update in Firestore if connected
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && firestoreDbInstance) {
    try {
      await firestoreDbInstance.collection('users').doc(teacherId).update({ status: 'approved' });
    } catch (e) {
      console.warn('Firestore teacher approval notice:', e);
    }
  }

  const users = AMS.getUsers();
  const teacher = users.find(u => u.id === teacherId);
  if (!teacher) return;

  teacher.status = 'approved';
  AMS.saveUsers(users);

  showToast('Teacher Approved!', `${teacher.name} has been approved. They can now log in and manage courses.`, 'success');
  renderPrincipalDashboard();
  initAppShell();
}

async function rejectTeacherRegistration(teacherId) {
  if (!confirm('Are you sure you want to reject and remove this teacher registration?')) return;

  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && firestoreDbInstance) {
    try {
      await firestoreDbInstance.collection('users').doc(teacherId).delete();
    } catch (e) {
      console.warn('Firestore teacher deletion notice:', e);
    }
  }

  let users = AMS.getUsers();
  const teacher = users.find(u => u.id === teacherId);
  users = users.filter(u => u.id !== teacherId);
  AMS.saveUsers(users);

  showToast('Registration Rejected', `Teacher registration for ${teacher?.name || 'faculty'} has been removed.`, 'info');
  renderPrincipalDashboard();
  initAppShell();
}

function exportInstitutionSummary() {
  const users = AMS.getUsers();
  const subjects = AMS.getSubjects();

  let csv = 'TIT GROUP OF INSTITUTIONS - ADMINISTRATIVE SUMMARY REPORT\r\n';
  csv += `Generated On,${new Date().toLocaleString()}\r\n\r\n`;

  csv += 'FACULTY ROSTER\r\n';
  csv += 'Name,Faculty ID,Department,Email,Status\r\n';
  users.filter(u => u.role === 'teacher').forEach(t => {
    csv += `"${t.name}","${t.teacherId || ''}","${t.department || ''}","${t.email}","${t.status}"\r\n`;
  });

  csv += '\r\nCOURSES & SUBJECTS\r\n';
  csv += 'Subject Code,Title,Department,Semester,Faculty Name\r\n';
  subjects.forEach(s => {
    csv += `"${s.code}","${s.title}","${s.department}","${s.semester}","${s.teacherName}"\r\n`;
  });

  downloadCSVFile(csv, `TIT_Institution_Summary_${new Date().toISOString().split('T')[0]}.csv`);
  showToast('Report Downloaded', 'Institution summary exported to Excel CSV.', 'success');
}

// ============================================================================
// 6. TEACHER WORKSPACE: SUBJECTS, JOIN REQUESTS, DAILY ATTENDANCE
// ============================================================================

function renderTeacherDashboard(user) {
  document.getElementById('teacherGreeting').textContent = `Welcome, ${user.name}`;

  const allSubjects = AMS.getSubjects();
  const mySubjects = allSubjects.filter(s => s.teacherId === user.id);
  const allJoinRequests = AMS.getJoinRequests();
  const myJoinRequests = allJoinRequests.filter(r => r.teacherId === user.id);
  const pendingRequests = myJoinRequests.filter(r => r.status === 'pending');
  const acceptedRequests = myJoinRequests.filter(r => r.status === 'accepted');
  const allAttendance = AMS.getAttendance();
  const myAttendance = allAttendance.filter(a => a.teacherId === user.id);

  // KPIs
  document.getElementById('tKpiSubjects').textContent = mySubjects.length;
  const enrolledStudentIds = new Set(acceptedRequests.map(r => r.studentId));
  document.getElementById('tKpiStudents').textContent = enrolledStudentIds.size;
  document.getElementById('tKpiSessions').textContent = myAttendance.length;
  document.getElementById('tKpiPendingRequests').textContent = pendingRequests.length;

  // Pending Join Requests Card
  const joinCard = document.getElementById('teacherJoinRequestsCard');
  const tbodyJoin = document.getElementById('tbodyTeacherJoinRequests');
  const pendingCountBadge = document.getElementById('pendingJoinCountBadge');

  if (pendingRequests.length > 0) {
    joinCard.style.display = 'block';
    pendingCountBadge.textContent = `${pendingRequests.length} Pending`;
    tbodyJoin.innerHTML = pendingRequests.map(req => `
      <tr>
        <td><strong>${req.studentName}</strong></td>
        <td><code>${req.studentRoll}</code></td>
        <td><span class="badge badge-info">${req.subjectCode}: ${req.subjectName}</span></td>
        <td>${req.studentSemester || 'Semester 5'} (${req.studentDept || 'Dept'})</td>
        <td>${req.requestedAt || 'Recent'}</td>
        <td class="text-right">
          <button type="button" class="btn btn-sm btn-outline-success" onclick="acceptStudentJoinRequest('${req.id}')">
            <i class="fa-solid fa-check"></i> Accept Student
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="rejectStudentJoinRequest('${req.id}')">
            <i class="fa-solid fa-xmark"></i> Reject
          </button>
        </td>
      </tr>
    `).join('');
  } else {
    joinCard.style.display = 'none';
  }

  // Populate Subject Select dropdown
  const subSelect = document.getElementById('attSubjectSelect');
  subSelect.innerHTML = '';
  if (mySubjects.length === 0) {
    subSelect.innerHTML = '<option value="">No subjects created yet</option>';
    currentTeacherSelectedSubjectId = null;
  } else {
    mySubjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.code} - ${s.title}`;
      subSelect.appendChild(opt);
    });

    if (!currentTeacherSelectedSubjectId || !mySubjects.some(s => s.id === currentTeacherSelectedSubjectId)) {
      currentTeacherSelectedSubjectId = mySubjects[0].id;
    }
    subSelect.value = currentTeacherSelectedSubjectId;
  }

  // Set date picker
  const dateInput = document.getElementById('attDateSelect');
  if (!dateInput.value) {
    dateInput.value = currentTeacherSelectedDate;
  } else {
    currentTeacherSelectedDate = dateInput.value;
  }

  // Render Daily Attendance Marking Sheet
  renderTeacherAttendanceSheet();

  // Render My Managed Subjects Grid
  const subjectsGrid = document.getElementById('teacherSubjectsCardsGrid');
  if (mySubjects.length === 0) {
    subjectsGrid.innerHTML = `
      <div class="empty-state-box" style="grid-column: 1 / -1;">
        <i class="fa-solid fa-chalkboard"></i>
        <h4>No Subjects Created Yet</h4>
        <p>Click "Create New Subject" above to launch a new course for students to join.</p>
      </div>
    `;
  } else {
    subjectsGrid.innerHTML = mySubjects.map(sub => {
      const subEnrolled = acceptedRequests.filter(r => r.subjectId === sub.id).length;
      const subSessions = myAttendance.filter(a => a.subjectId === sub.id).length;
      return `
        <div class="subject-card">
          <div>
            <div class="sub-card-header">
              <span class="sub-code-badge">${sub.code}</span>
              <span class="badge badge-info">${sub.semester}</span>
            </div>
            <h4 class="sub-title">${sub.title}</h4>
            <p class="sub-desc">${sub.desc || 'No description provided.'}</p>
          </div>
          <div class="sub-meta-row">
            <span><i class="fa-solid fa-users"></i> ${subEnrolled} Students Enrolled</span>
            <span><i class="fa-solid fa-calendar-check"></i> ${subSessions} Classes</span>
          </div>
        </div>
      `;
    }).join('');
  }
}

function onTeacherSubjectChange() {
  currentTeacherSelectedSubjectId = document.getElementById('attSubjectSelect').value;
  renderTeacherAttendanceSheet();
}

function onTeacherAttendanceDateChange() {
  currentTeacherSelectedDate = document.getElementById('attDateSelect').value;
  renderTeacherAttendanceSheet();
}

// Student Join Request Workflow (Accept / Reject)
async function acceptStudentJoinRequest(requestId) {
  const requests = AMS.getJoinRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) return;

  req.status = 'accepted';
  AMS.saveJoinRequests(requests);

  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && firestoreDbInstance) {
    try {
      await firestoreDbInstance.collection('joinRequests').doc(requestId).update({ status: 'accepted' });
    } catch (e) {
      console.warn('Firestore join request update notice:', e);
    }
  }

  showToast('Student Enrolled', `${req.studentName} has been enrolled in ${req.subjectName}!`, 'success');
  const user = AMS.getCurrentUser();
  renderTeacherDashboard(user);
}

async function rejectStudentJoinRequest(requestId) {
  const requests = AMS.getJoinRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) return;

  req.status = 'rejected';
  AMS.saveJoinRequests(requests);

  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && firestoreDbInstance) {
    try {
      await firestoreDbInstance.collection('joinRequests').doc(requestId).update({ status: 'rejected' });
    } catch (e) {
      console.warn('Firestore join request rejection notice:', e);
    }
  }

  showToast('Request Declined', `Join request from ${req.studentName} was rejected.`, 'info');
  const user = AMS.getCurrentUser();
  renderTeacherDashboard(user);
}

// Subject Creation (Both Teachers & Principal Sir!)
function openCreateSubjectModal() {
  const user = AMS.getCurrentUser();
  const assignGroup = document.getElementById('assignFacultyGroup');
  const teacherSelect = document.getElementById('newSubjectTeacherSelect');

  if (user && user.role === 'principal') {
    assignGroup.style.display = 'block';
    teacherSelect.innerHTML = '';

    // Self option (Principal Sir)
    const optSelf = document.createElement('option');
    optSelf.value = user.id;
    optSelf.textContent = `${user.name} (Principal Sir / Institutional Course)`;
    teacherSelect.appendChild(optSelf);

    // Approved teachers list
    const teachers = AMS.getUsers().filter(u => u.role === 'teacher' && u.status === 'approved');
    teachers.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.name} (${t.department} - ${t.teacherId || 'Faculty'})`;
      teacherSelect.appendChild(opt);
    });
  } else {
    assignGroup.style.display = 'none';
  }

  document.getElementById('modalCreateSubject').style.display = 'flex';
}

async function handleCreateSubjectSubmit(event) {
  event.preventDefault();
  const user = AMS.getCurrentUser();
  if (!user || (user.role !== 'teacher' && user.role !== 'principal')) {
    showToast('Unauthorized', 'Only faculty and Principal Sir can create subjects.', 'error');
    return;
  }

  const title = document.getElementById('newSubjectName').value.trim();
  const code = document.getElementById('newSubjectCode').value.trim().toUpperCase();
  const semester = document.getElementById('newSubjectSemester').value;
  const department = document.getElementById('newSubjectDept').value;
  const desc = document.getElementById('newSubjectDesc').value.trim();

  if (!title || !code) {
    showToast('Input Required', 'Please enter subject title and subject code.', 'warning');
    return;
  }

  const subjects = AMS.getSubjects();
  if (subjects.some(s => s.code.toLowerCase() === code.toLowerCase())) {
    showToast('Code Exists', `Subject code ${code} is already registered.`, 'warning');
    return;
  }

  let assignedTeacherId = user.id;
  let assignedTeacherName = user.name;

  if (user.role === 'principal') {
    const selectedId = document.getElementById('newSubjectTeacherSelect').value;
    const assignedUser = AMS.getUsers().find(u => u.id === selectedId) || user;
    assignedTeacherId = assignedUser.id;
    assignedTeacherName = assignedUser.name;
  }

  const subId = `sub_${Date.now()}`;
  const newSub = {
    id: subId,
    code: code,
    title: title,
    teacherId: assignedTeacherId,
    teacherName: assignedTeacherName,
    department: department,
    semester: semester,
    desc: desc,
    createdBy: user.role === 'principal' ? 'Principal Sir' : user.name
  };

  subjects.push(newSub);
  AMS.saveSubjects(subjects);

  // Sync to Cloud Firestore if connected
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && firestoreDbInstance) {
    try {
      await firestoreDbInstance.collection('subjects').doc(subId).set(newSub);
    } catch (e) {
      console.warn('Firestore subject sync notice:', e);
    }
  }

  showToast('Subject Created Successfully!', `${code} - ${title} assigned to ${assignedTeacherName}. Available for student join requests.`, 'success');
  closeModal('modalCreateSubject');
  event.target.reset();

  if (user.role === 'principal') {
    renderPrincipalDashboard();
  } else {
    currentTeacherSelectedSubjectId = newSub.id;
    renderTeacherDashboard(user);
  }
}

// Daily Attendance Marking Sheet Renderer
function renderTeacherAttendanceSheet() {
  const subjectId = currentTeacherSelectedSubjectId;
  const selectedDate = currentTeacherSelectedDate;
  const tbody = document.getElementById('tbodyAttendanceStudents');
  const emptyNotice = document.getElementById('noStudentsInSubjectNotice');

  if (!subjectId) {
    tbody.innerHTML = '';
    emptyNotice.style.display = 'block';
    updateLiveAttendanceCounters();
    return;
  }

  const requests = AMS.getJoinRequests();
  const enrolledRequests = requests.filter(r => r.subjectId === subjectId && r.status === 'accepted');
  const users = AMS.getUsers();

  if (enrolledRequests.length === 0) {
    tbody.innerHTML = '';
    emptyNotice.style.display = 'block';
    updateLiveAttendanceCounters();
    return;
  }

  emptyNotice.style.display = 'none';

  const allAtt = AMS.getAttendance();
  const existingSession = allAtt.find(a => a.subjectId === subjectId && a.date === selectedDate);
  const subSessions = allAtt.filter(a => a.subjectId === subjectId);
  const totalConducted = subSessions.length;

  tbody.innerHTML = enrolledRequests.map(req => {
    const student = users.find(u => u.id === req.studentId) || { name: req.studentName, rollNo: req.studentRoll };
    
    let studentTodayStatus = 'present';
    let remarks = '';

    if (existingSession) {
      const studentRec = existingSession.records.find(r => r.studentId === req.studentId);
      if (studentRec) {
        studentTodayStatus = studentRec.status;
        remarks = studentRec.remarks || '';
      }
    }

    let studentAttended = 0;
    subSessions.forEach(sess => {
      const rec = sess.records.find(r => r.studentId === req.studentId);
      if (rec && (rec.status === 'present' || rec.status === 'late')) {
        studentAttended++;
      }
    });

    const cumPct = totalConducted > 0 ? Math.round((studentAttended / totalConducted) * 100) : 100;
    const badgeClass = cumPct >= 75 ? 'badge-success' : cumPct >= 60 ? 'badge-warning' : 'badge-danger';

    return `
      <tr data-student-id="${req.studentId}" data-student-name="${escapeHtml(student.name)}" data-student-roll="${student.rollNo}">
        <td><strong>${student.rollNo}</strong></td>
        <td>
          <div style="font-weight: 600;">${student.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${student.email || ''}</div>
        </td>
        <td>${req.studentDept || 'Dept'} (${req.studentSemester || 'Sem'})</td>
        <td>
          <span class="badge ${badgeClass}">${cumPct}% (${studentAttended}/${totalConducted})</span>
        </td>
        <td class="text-center">
          <div class="att-status-group" role="group">
            <button type="button" class="btn-att-toggle ${studentTodayStatus === 'present' ? 'active-present' : ''}" 
              onclick="setStudentRowStatus(this, 'present')">P (Present)</button>
            <button type="button" class="btn-att-toggle ${studentTodayStatus === 'absent' ? 'active-absent' : ''}" 
              onclick="setStudentRowStatus(this, 'absent')">A (Absent)</button>
            <button type="button" class="btn-att-toggle ${studentTodayStatus === 'late' ? 'active-late' : ''}" 
              onclick="setStudentRowStatus(this, 'late')">L (Late)</button>
          </div>
        </td>
        <td>
          <input type="text" class="att-remark-input" value="${escapeHtml(remarks)}" placeholder="Optional remark (e.g. Lab, Excused)...">
        </td>
      </tr>
    `;
  }).join('');

  updateLiveAttendanceCounters();
}

function setStudentRowStatus(btn, status) {
  const group = btn.closest('.att-status-group');
  group.querySelectorAll('.btn-att-toggle').forEach(b => {
    b.className = 'btn-att-toggle';
  });

  if (status === 'present') btn.classList.add('active-present');
  else if (status === 'absent') btn.classList.add('active-absent');
  else if (status === 'late') btn.classList.add('active-late');

  updateLiveAttendanceCounters();
}

function markAllAttendance(status) {
  const rows = document.querySelectorAll('#tbodyAttendanceStudents tr');
  rows.forEach(row => {
    const group = row.querySelector('.att-status-group');
    if (!group) return;
    const targetBtn = group.querySelector(status === 'present' ? '.btn-att-toggle:nth-child(1)' : '.btn-att-toggle:nth-child(2)');
    if (targetBtn) {
      setStudentRowStatus(targetBtn, status);
    }
  });
  showToast('Status Updated', `All students marked as ${status.toUpperCase()} for selected date.`, 'info', 2000);
}

function updateLiveAttendanceCounters() {
  const rows = document.querySelectorAll('#tbodyAttendanceStudents tr');
  let presents = 0;
  let absents = 0;

  rows.forEach(row => {
    if (row.querySelector('.active-present') || row.querySelector('.active-late')) {
      presents++;
    } else if (row.querySelector('.active-absent')) {
      absents++;
    }
  });

  const pEl = document.getElementById('countPresent');
  const aEl = document.getElementById('countAbsent');
  if (pEl) pEl.textContent = presents;
  if (aEl) aEl.textContent = absents;
}

async function saveCurrentDayAttendance() {
  const subjectId = currentTeacherSelectedSubjectId;
  const date = currentTeacherSelectedDate;
  const user = AMS.getCurrentUser();

  if (!subjectId) {
    showToast('Select Subject', 'Please select a subject first.', 'warning');
    return;
  }
  if (!date) {
    showToast('Select Date', 'Please select a valid date.', 'warning');
    return;
  }

  const rows = document.querySelectorAll('#tbodyAttendanceStudents tr');
  if (rows.length === 0) {
    showToast('No Students', 'No enrolled students to mark attendance for.', 'warning');
    return;
  }

  const records = [];
  rows.forEach(row => {
    const studentId = row.getAttribute('data-student-id');
    const rollNo = row.getAttribute('data-student-roll');
    const name = row.getAttribute('data-student-name');
    const remarks = row.querySelector('.att-remark-input').value.trim();

    let status = 'present';
    if (row.querySelector('.active-absent')) status = 'absent';
    else if (row.querySelector('.active-late')) status = 'late';

    records.push({ studentId, rollNo, name, status, remarks });
  });

  const allAtt = AMS.getAttendance();
  const existingIndex = allAtt.findIndex(a => a.subjectId === subjectId && a.date === date);
  const recId = existingIndex >= 0 ? allAtt[existingIndex].id : `att_${Date.now()}`;

  const newRecord = {
    id: recId,
    subjectId: subjectId,
    date: date,
    teacherId: user.id,
    teacherName: user.name,
    records: records,
    savedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    allAtt[existingIndex] = newRecord;
  } else {
    allAtt.push(newRecord);
  }

  AMS.saveAttendance(allAtt);

  // Sync to Firestore if connected
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && firestoreDbInstance) {
    try {
      await firestoreDbInstance.collection('attendance').doc(recId).set(newRecord);
    } catch (e) {
      console.warn('Firestore attendance sync notice:', e);
    }
  }

  showToast('Attendance Saved!', `Recorded attendance for ${records.length} students on ${date}.`, 'success');
  renderTeacherDashboard(user);
}

// EXPORT TO EXCEL (.CSV)
function exportAttendanceToExcel() {
  const subjectId = currentTeacherSelectedSubjectId;
  if (!subjectId) {
    showToast('No Subject Selected', 'Select a subject to export.', 'warning');
    return;
  }

  const subjects = AMS.getSubjects();
  const subject = subjects.find(s => s.id === subjectId);
  const allAtt = AMS.getAttendance().filter(a => a.subjectId === subjectId);
  allAtt.sort((a, b) => new Date(a.date) - new Date(b.date));

  const requests = AMS.getJoinRequests().filter(r => r.subjectId === subjectId && r.status === 'accepted');
  const users = AMS.getUsers();

  if (requests.length === 0) {
    showToast('No Data', 'No enrolled students found to export.', 'warning');
    return;
  }

  let csv = 'TIT GROUP OF INSTITUTIONS - OFFICIAL ATTENDANCE REGISTER\r\n';
  csv += `Subject:,"${subject?.title} (${subject?.code})"\r\n`;
  csv += `Faculty:,"${subject?.teacherName}"\r\n`;
  csv += `Department:,"${subject?.department}"\r\n`;
  csv += `Generated Date:,"${new Date().toLocaleString()}"\r\n`;
  csv += `Total Sessions Conducted:,"${allAtt.length}"\r\n\r\n`;

  const dates = allAtt.map(a => a.date);
  const headerCols = ['Sl.', 'Roll No', 'Student Name', 'Branch', 'Total Classes', 'Attended', 'Attendance %', 'Criteria Status', ...dates];
  csv += headerCols.map(c => `"${c}"`).join(',') + '\r\n';

  requests.forEach((req, idx) => {
    const student = users.find(u => u.id === req.studentId) || { name: req.studentName, rollNo: req.studentRoll };
    let attended = 0;
    const sessionStatuses = [];

    dates.forEach(d => {
      const sess = allAtt.find(a => a.date === d);
      const studentRec = sess?.records.find(r => r.studentId === req.studentId);
      if (studentRec) {
        if (studentRec.status === 'present' || studentRec.status === 'late') attended++;
        sessionStatuses.push(studentRec.status.toUpperCase().charAt(0));
      } else {
        sessionStatuses.push('-');
      }
    });

    const pct = allAtt.length > 0 ? Math.round((attended / allAtt.length) * 100) : 100;
    const criteria = pct >= 75 ? 'ELIGIBLE' : 'SHORT ATTENDANCE (<75%)';

    const row = [
      idx + 1,
      student.rollNo,
      student.name,
      req.studentDept || 'Dept',
      allAtt.length,
      attended,
      `${pct}%`,
      criteria,
      ...sessionStatuses
    ];

    csv += row.map(cell => `"${cell}"`).join(',') + '\r\n';
  });

  downloadCSVFile(csv, `Attendance_${subject?.code || 'Subject'}_${new Date().toISOString().split('T')[0]}.csv`);
  showToast('Excel Sheet Exported', `Downloaded attendance for ${subject?.title} in CSV format.`, 'success');
}

// EXPORT TO PDF / OFFICIAL PRINTABLE REGISTER
function openPrintAttendancePDF() {
  const subjectId = currentTeacherSelectedSubjectId;
  if (!subjectId) {
    showToast('No Subject Selected', 'Select a subject to export.', 'warning');
    return;
  }

  const subjects = AMS.getSubjects();
  const subject = subjects.find(s => s.id === subjectId);
  const allAtt = AMS.getAttendance().filter(a => a.subjectId === subjectId);
  const requests = AMS.getJoinRequests().filter(r => r.subjectId === subjectId && r.status === 'accepted');
  const users = AMS.getUsers();

  document.getElementById('prtSubjectName').textContent = subject ? subject.title : '-';
  document.getElementById('prtSubjectCode').textContent = subject ? subject.code : '-';
  document.getElementById('prtFacultyName').textContent = subject ? subject.teacherName : '-';
  document.getElementById('prtGeneratedDate').textContent = new Date().toLocaleString();

  const tbody = document.getElementById('prtTableBody');
  tbody.innerHTML = requests.map((req, idx) => {
    const student = users.find(u => u.id === req.studentId) || { name: req.studentName, rollNo: req.studentRoll };
    let attended = 0;
    allAtt.forEach(sess => {
      const r = sess.records.find(rec => rec.studentId === req.studentId);
      if (r && (r.status === 'present' || r.status === 'late')) attended++;
    });

    const pct = allAtt.length > 0 ? Math.round((attended / allAtt.length) * 100) : 100;
    const isEligible = pct >= 75;

    return `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${student.rollNo}</strong></td>
        <td>${student.name}</td>
        <td>${allAtt.length}</td>
        <td>${attended}</td>
        <td><strong>${pct}%</strong></td>
        <td>${isEligible ? '<span style="color:green;font-weight:bold;">ELIGIBLE</span>' : '<span style="color:red;font-weight:bold;">SHORT (<75%)</span>'}</td>
      </tr>
    `;
  }).join('');

  window.print();
}

function downloadCSVFile(content, fileName) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================================
// 7. STUDENT WORKSPACE: BROWSE & JOIN SUBJECTS, ATTENDANCE BREAKDOWN
// ============================================================================

function renderStudentDashboard(user) {
  document.getElementById('studentGreeting').textContent = `Welcome, ${user.name} (${user.rollNo || 'Student'})`;

  const allRequests = AMS.getJoinRequests();
  const myRequests = allRequests.filter(r => r.studentId === user.id);
  const acceptedRequests = myRequests.filter(r => r.status === 'accepted');
  const pendingRequests = myRequests.filter(r => r.status === 'pending');

  const allAtt = AMS.getAttendance();
  const subjects = AMS.getSubjects();

  let totalClassesConducted = 0;
  let totalClassesAttended = 0;

  const subjectStats = acceptedRequests.map(req => {
    const sub = subjects.find(s => s.id === req.subjectId);
    const subSessions = allAtt.filter(a => a.subjectId === req.subjectId);
    let attended = 0;

    subSessions.forEach(sess => {
      const rec = sess.records.find(r => r.studentId === user.id);
      if (rec && (rec.status === 'present' || rec.status === 'late')) {
        attended++;
      }
    });

    totalClassesConducted += subSessions.length;
    totalClassesAttended += attended;

    const pct = subSessions.length > 0 ? Math.round((attended / subSessions.length) * 100) : 100;

    return {
      subject: sub || { title: req.subjectName, code: req.subjectCode, teacherName: 'Faculty' },
      total: subSessions.length,
      attended: attended,
      pct: pct
    };
  });

  const overallPct = totalClassesConducted > 0 ? Math.round((totalClassesAttended / totalClassesConducted) * 100) : 100;

  // Student KPIs
  const kpiOverall = document.getElementById('sKpiOverallPercent');
  kpiOverall.textContent = `${overallPct}%`;
  kpiOverall.style.color = overallPct >= 75 ? 'var(--success)' : overallPct >= 60 ? 'var(--warning)' : 'var(--danger)';

  const kpiEligibility = document.getElementById('sKpiStatusEligibility');
  if (overallPct >= 75) {
    kpiEligibility.textContent = 'Eligible for Exams (>=75%)';
    kpiEligibility.className = 'kpi-hint';
  } else {
    kpiEligibility.textContent = 'Short Attendance Alert (<75%)';
    kpiEligibility.className = 'kpi-hint status-alert';
  }

  document.getElementById('sKpiEnrolledSubjects').textContent = acceptedRequests.length;
  document.getElementById('sKpiClassesAttended').textContent = totalClassesAttended;
  document.getElementById('sKpiClassesTotal').textContent = `Out of ${totalClassesConducted} conducted`;
  document.getElementById('sKpiPendingRequests').textContent = pendingRequests.length;

  // Enrolled Subjects Table
  const tbodyEnrolled = document.getElementById('tbodyStudentEnrolledSubjects');
  if (acceptedRequests.length === 0) {
    tbodyEnrolled.innerHTML = `
      <tr>
        <td colspan="7" class="text-center" style="padding: 30px; color: var(--text-muted);">
          <i class="fa-solid fa-book-open" style="font-size: 1.6rem; color: #94a3b8; margin-bottom: 8px; display:block;"></i>
          You are not enrolled in any subjects yet. Click <strong>"Join More Subjects"</strong> above to send join requests to faculty!
        </td>
      </tr>
    `;
  } else {
    tbodyEnrolled.innerHTML = subjectStats.map(stat => {
      const isEligible = stat.pct >= 75;
      return `
        <tr>
          <td><span class="sub-code-badge">${stat.subject.code}</span></td>
          <td><strong>${stat.subject.title}</strong></td>
          <td>${stat.subject.teacherName || 'Faculty'}</td>
          <td>${stat.attended} / ${stat.total} classes</td>
          <td>
            <span class="badge ${isEligible ? 'badge-success' : stat.pct >= 60 ? 'badge-warning' : 'badge-danger'}">
              ${stat.pct}%
            </span>
          </td>
          <td>
            ${isEligible ? '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Eligible</span>' : '<span class="badge badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> Low Attendance</span>'}
          </td>
          <td class="text-right">
            <button type="button" class="btn btn-sm btn-outline" onclick="openStudentAttendanceHistory('${stat.subject.id}')">
              <i class="fa-solid fa-clock-rotate-left"></i> View Dates
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Join Request History Table
  const tbodyRequests = document.getElementById('tbodyStudentRequestsHistory');
  if (myRequests.length === 0) {
    tbodyRequests.innerHTML = `
      <tr>
        <td colspan="6" class="text-center" style="padding: 20px; color: var(--text-muted);">
          No subject join requests sent yet.
        </td>
      </tr>
    `;
  } else {
    tbodyRequests.innerHTML = myRequests.map(req => {
      let statusBadge = '<span class="badge badge-warning"><i class="fa-solid fa-hourglass-start"></i> Pending Teacher Approval</span>';
      if (req.status === 'accepted') statusBadge = '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Enrolled & Approved</span>';
      if (req.status === 'rejected') statusBadge = '<span class="badge badge-danger"><i class="fa-solid fa-xmark"></i> Declined by Teacher</span>';

      return `
        <tr>
          <td><strong>${req.subjectName}</strong></td>
          <td><code>${req.subjectCode}</code></td>
          <td>${getTeacherNameById(req.teacherId)}</td>
          <td>${req.requestedAt || 'Recent'}</td>
          <td>${statusBadge}</td>
          <td>${req.status === 'pending' ? 'Waiting for respective teacher to accept' : req.status === 'accepted' ? 'Active student' : 'Please contact faculty'}</td>
        </tr>
      `;
    }).join('');
  }
}

function getTeacherNameById(teacherId) {
  const users = AMS.getUsers();
  const t = users.find(u => u.id === teacherId);
  return t ? t.name : 'Faculty Member';
}

function openBrowseSubjectsModal() {
  document.getElementById('modalBrowseSubjects').style.display = 'flex';
  renderBrowseSubjectsList();
}

function renderBrowseSubjectsList() {
  const user = AMS.getCurrentUser();
  if (!user) return;

  const query = (document.getElementById('browseSearchInput')?.value || '').toLowerCase().trim();
  const container = document.getElementById('browseSubjectsContainer');
  const subjects = AMS.getSubjects();
  const myRequests = AMS.getJoinRequests().filter(r => r.studentId === user.id);

  const filtered = subjects.filter(s => {
    return s.title.toLowerCase().includes(query) ||
           s.code.toLowerCase().includes(query) ||
           s.teacherName.toLowerCase().includes(query) ||
           (s.department && s.department.toLowerCase().includes(query));
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>No subjects found matching "${query}".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(sub => {
    const existingReq = myRequests.find(r => r.subjectId === sub.id);
    let actionBtn = '';

    if (existingReq) {
      if (existingReq.status === 'accepted') {
        actionBtn = '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Enrolled</span>';
      } else if (existingReq.status === 'pending') {
        actionBtn = '<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Request Pending</span>';
      } else {
        actionBtn = `
          <button type="button" class="btn btn-sm btn-primary" onclick="sendSubjectJoinRequest('${sub.id}')">
            <i class="fa-solid fa-paper-plane"></i> Re-send Request
          </button>
        `;
      }
    } else {
      actionBtn = `
        <button type="button" class="btn btn-sm btn-primary" onclick="sendSubjectJoinRequest('${sub.id}')">
          <i class="fa-solid fa-paper-plane"></i> Send Join Request
        </button>
      `;
    }

    return `
      <div class="browse-sub-item">
        <div class="browse-sub-info">
          <h4>${sub.title} <span class="sub-code-badge">${sub.code}</span></h4>
          <p><i class="fa-solid fa-chalkboard-user"></i> Faculty: <strong>${sub.teacherName}</strong> | Department: ${sub.department} (${sub.semester})</p>
          <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 4px;">${sub.desc || ''}</div>
        </div>
        <div>
          ${actionBtn}
        </div>
      </div>
    `;
  }).join('');
}

async function sendSubjectJoinRequest(subjectId) {
  const user = AMS.getCurrentUser();
  if (!user || user.role !== 'student') return;

  const subjects = AMS.getSubjects();
  const sub = subjects.find(s => s.id === subjectId);
  if (!sub) return;

  const requests = AMS.getJoinRequests();
  const existing = requests.find(r => r.studentId === user.id && r.subjectId === subjectId);
  const reqId = existing ? existing.id : `req_${Date.now()}`;

  if (existing) {
    if (existing.status === 'accepted') {
      showToast('Already Enrolled', 'You are already an approved student in this subject.', 'info');
      return;
    }
    if (existing.status === 'pending') {
      showToast('Request Pending', 'Your request is already waiting for the teacher to accept.', 'info');
      return;
    }
    existing.status = 'pending';
    existing.requestedAt = new Date().toISOString().split('T')[0];
  } else {
    const newReq = {
      id: reqId,
      studentId: user.id,
      studentName: user.name,
      studentRoll: user.rollNo,
      studentDept: user.department,
      studentSemester: user.semester,
      subjectId: sub.id,
      subjectName: sub.title,
      subjectCode: sub.code,
      teacherId: sub.teacherId,
      status: 'pending',
      requestedAt: new Date().toISOString().split('T')[0]
    };
    requests.push(newReq);
  }

  AMS.saveJoinRequests(requests);

  // Sync to Cloud Firestore if connected
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && firestoreDbInstance) {
    try {
      const currentReq = requests.find(r => r.id === reqId);
      await firestoreDbInstance.collection('joinRequests').doc(reqId).set(currentReq);
    } catch (e) {
      console.warn('Firestore join request sync notice:', e);
    }
  }

  showToast('Join Request Sent!', `Your request to join ${sub.code}: ${sub.title} has been sent to ${sub.teacherName} for approval.`, 'success');
  renderBrowseSubjectsList();
  renderStudentDashboard(user);
}

function openStudentAttendanceHistory(subjectId) {
  const user = AMS.getCurrentUser();
  const subjects = AMS.getSubjects();
  const sub = subjects.find(s => s.id === subjectId);
  const allAtt = AMS.getAttendance().filter(a => a.subjectId === subjectId);
  allAtt.sort((a, b) => new Date(b.date) - new Date(a.date));

  document.getElementById('attDetailSubjectTitle').textContent = `${sub?.code || ''}: ${sub?.title || 'Subject'} Attendance Records`;

  let attendedCount = 0;
  let totalCount = allAtt.length;

  const rowsHtml = allAtt.map(sess => {
    const studentRec = sess.records.find(r => r.studentId === user.id);
    const status = studentRec ? studentRec.status : 'absent';
    const remarks = studentRec ? studentRec.remarks : '';

    if (status === 'present' || status === 'late') attendedCount++;

    let badge = '<span class="badge badge-success">Present</span>';
    if (status === 'absent') badge = '<span class="badge badge-danger">Absent</span>';
    if (status === 'late') badge = '<span class="badge badge-warning">Late</span>';

    return `
      <tr>
        <td><strong>${sess.date}</strong></td>
        <td>${badge}</td>
        <td>${sess.teacherName}</td>
        <td>${remarks || '-'}</td>
      </tr>
    `;
  }).join('');

  const pct = totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 100;

  document.getElementById('attDetailSummaryBar').innerHTML = `
    <div class="att-detail-box">
      <span>Total Sessions</span>
      <strong>${totalCount}</strong>
    </div>
    <div class="att-detail-box">
      <span>Sessions Attended</span>
      <strong>${attendedCount}</strong>
    </div>
    <div class="att-detail-box">
      <span>Attendance Percentage</span>
      <strong style="color: ${pct >= 75 ? 'var(--success)' : 'var(--danger)'}">${pct}%</strong>
    </div>
  `;

  document.getElementById('tbodyAttSubjectHistory').innerHTML = rowsHtml || '<tr><td colspan="4" class="text-center">No attendance sessions recorded yet.</td></tr>';
  document.getElementById('modalAttendanceDetails').style.display = 'flex';
}

function exportStudentAttendanceReport() {
  const user = AMS.getCurrentUser();
  if (!user || user.role !== 'student') return;

  const allRequests = AMS.getJoinRequests().filter(r => r.studentId === user.id && r.status === 'accepted');
  const allAtt = AMS.getAttendance();
  const subjects = AMS.getSubjects();

  let csv = 'TIT GROUP OF INSTITUTIONS - STUDENT ATTENDANCE REPORT\r\n';
  csv += `Student Name:,"${user.name}"\r\n`;
  csv += `Roll Number:,"${user.rollNo}"\r\n`;
  csv += `Department:,"${user.department}"\r\n`;
  csv += `Semester:,"${user.semester}"\r\n`;
  csv += `Report Generated:,"${new Date().toLocaleString()}"\r\n\r\n`;

  csv += 'Subject Code,Subject Name,Faculty,Total Classes,Attended,Attendance %,Status\r\n';

  allRequests.forEach(req => {
    const sub = subjects.find(s => s.id === req.subjectId);
    const subSessions = allAtt.filter(a => a.subjectId === req.subjectId);
    let attended = 0;
    subSessions.forEach(sess => {
      const r = sess.records.find(rec => rec.studentId === user.id);
      if (r && (r.status === 'present' || r.status === 'late')) attended++;
    });

    const pct = subSessions.length > 0 ? Math.round((attended / subSessions.length) * 100) : 100;
    const isEligible = pct >= 75 ? 'ELIGIBLE' : 'SHORT ATTENDANCE';

    csv += `"${sub?.code}","${sub?.title}","${sub?.teacherName}",${subSessions.length},${attended},"${pct}%","${isEligible}"\r\n`;
  });

  downloadCSVFile(csv, `My_Attendance_${user.rollNo}_${new Date().toISOString().split('T')[0]}.csv`);
  showToast('Report Downloaded', 'Your personal attendance summary has been exported.', 'success');
}

// ============================================================================
// 8. ACADEMIC HOLIDAYS (Separate Section)
// ============================================================================

let currentHolidayCategoryFilter = 'all';

function renderAcademicHolidaysView(user) {
  const btnAdd = document.getElementById('btnAdminAddHoliday');
  if (user.role === 'principal') {
    btnAdd.style.display = 'inline-flex';
  } else {
    btnAdd.style.display = 'none';
  }

  const holidays = AMS.getHolidays();
  holidays.sort((a, b) => new Date(a.date) - new Date(b.date));

  const today = new Date().toISOString().split('T')[0];
  const upcoming = holidays.find(h => h.date >= today) || holidays[0];

  if (upcoming) {
    document.getElementById('nextHolidayTitle').textContent = upcoming.title;
    document.getElementById('nextHolidayDate').textContent = `${upcoming.date} (${upcoming.type} Holiday)`;

    const d1 = new Date();
    const d2 = new Date(upcoming.date);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    document.getElementById('holidayDaysLeft').textContent = diffDays;
  }

  renderHolidaysGrid(holidays);
}

function filterHolidays(cat, btn) {
  currentHolidayCategoryFilter = cat;
  document.querySelectorAll('.holiday-filter-group .filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const holidays = AMS.getHolidays();
  holidays.sort((a, b) => new Date(a.date) - new Date(b.date));
  renderHolidaysGrid(holidays);
}

function renderHolidaysGrid(holidays) {
  const container = document.getElementById('holidaysListGrid');
  const cat = currentHolidayCategoryFilter;

  const filtered = cat === 'all' ? holidays : holidays.filter(h => h.type.toLowerCase() === cat.toLowerCase());

  if (filtered.length === 0) {
    container.innerHTML = '<p class="text-muted" style="grid-column: 1 / -1; padding: 20px;">No holidays found in this category.</p>';
    return;
  }

  container.innerHTML = filtered.map(h => {
    const d = new Date(h.date);
    const month = d.toLocaleString('en-US', { month: 'short' });
    const day = d.getDate();

    let tagColor = 'badge-info';
    if (h.type === 'National') tagColor = 'badge-success';
    if (h.type === 'Festival') tagColor = 'badge-warning';

    return `
      <div class="holiday-item-card">
        <div class="holiday-date-box">
          <span class="h-month">${month}</span>
          <span class="h-day">${day}</span>
        </div>
        <div class="holiday-info">
          <h4>${h.title}</h4>
          <p>${h.desc || 'Institute Holiday'}</p>
          <span class="badge ${tagColor}" style="margin-top: 6px;">${h.type}</span>
        </div>
      </div>
    `;
  }).join('');
}

function openAddHolidayModal() {
  document.getElementById('modalAddHoliday').style.display = 'flex';
}

async function handleAddHolidaySubmit(event) {
  event.preventDefault();
  const user = AMS.getCurrentUser();
  if (!user || user.role !== 'principal') {
    showToast('Unauthorized', 'Only Principal Sir can add official institutional holidays.', 'error');
    return;
  }

  const title = document.getElementById('holTitle').value.trim();
  const date = document.getElementById('holDate').value;
  const type = document.getElementById('holType').value;
  const desc = document.getElementById('holDesc').value.trim();

  if (!title || !date) {
    showToast('Input Required', 'Please enter title and date for holiday.', 'warning');
    return;
  }

  const holId = `hol_${Date.now()}`;
  const newHol = { id: holId, title, date, type, desc };

  const holidays = AMS.getHolidays();
  holidays.push(newHol);
  AMS.saveHolidays(holidays);

  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && firestoreDbInstance) {
    try {
      await firestoreDbInstance.collection('holidays').doc(holId).set(newHol);
    } catch (e) {
      console.warn('Firestore holiday sync notice:', e);
    }
  }

  showToast('Holiday Added', `${title} added to the official academic calendar.`, 'success');
  closeModal('modalAddHoliday');
  event.target.reset();

  renderAcademicHolidaysView(user);
}

// ============================================================================
// 9. STUDY RESOURCES REPOSITORY (Separate Section)
// ============================================================================

function renderResourcesView(user) {
  const btnUpload = document.getElementById('btnUploadResourceTop');
  if (user.role === 'teacher' || user.role === 'principal') {
    btnUpload.style.display = 'inline-flex';
  } else {
    btnUpload.style.display = 'none';
  }

  const resSubSelect = document.getElementById('resSubjectSelect');
  if (resSubSelect) {
    resSubSelect.innerHTML = '';
    const subjects = AMS.getSubjects();
    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.code}: ${s.title} (${s.teacherName})`;
      resSubSelect.appendChild(opt);
    });
  }

  filterResourcesList();
}

function filterResourcesList() {
  const query = (document.getElementById('resourceSearchInput')?.value || '').toLowerCase().trim();
  const container = document.getElementById('resourcesCardsGrid');
  const resources = AMS.getResources();

  const filtered = resources.filter(r => {
    return r.title.toLowerCase().includes(query) ||
           (r.subjectName && r.subjectName.toLowerCase().includes(query)) ||
           (r.subjectCode && r.subjectCode.toLowerCase().includes(query)) ||
           (r.notes && r.notes.toLowerCase().includes(query)) ||
           (r.type && r.type.toLowerCase().includes(query));
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="grid-column: 1 / -1;">
        <i class="fa-solid fa-folder-open"></i>
        <h4>No Resources Found</h4>
        <p>No study materials matched "${query}".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(res => `
    <div class="resource-card">
      <div>
        <div class="res-header">
          <span class="res-type-badge"><i class="fa-solid fa-file-lines"></i> ${res.type}</span>
        </div>
        <h4 class="res-title">${res.title}</h4>
        <span class="res-subject-tag"><i class="fa-solid fa-book"></i> ${res.subjectCode || ''} ${res.subjectName || ''}</span>
        <p class="res-notes">${res.notes || 'Reference materials and study resources.'}</p>
      </div>
      <div class="res-footer">
        <span class="res-author"><i class="fa-solid fa-user-pen"></i> ${res.teacherName || 'Faculty'}</span>
        <a href="${res.link}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Open / Download
        </a>
      </div>
    </div>
  `).join('');
}

function openUploadResourceModal() {
  const user = AMS.getCurrentUser();
  if (!user || user.role === 'student') {
    showToast('Faculty Only', 'Only faculty members and Principal can publish study resources.', 'info');
    return;
  }
  document.getElementById('modalUploadResource').style.display = 'flex';
}

async function handleUploadResourceSubmit(event) {
  event.preventDefault();
  const user = AMS.getCurrentUser();
  if (!user || user.role === 'student') return;

  const title = document.getElementById('resTitle').value.trim();
  const subjectId = document.getElementById('resSubjectSelect').value;
  const type = document.getElementById('resType').value;
  const link = document.getElementById('resLink').value.trim();
  const notes = document.getElementById('resNotes').value.trim();

  if (!title || !subjectId || !link) {
    showToast('Input Required', 'Please provide title, subject, and resource link.', 'warning');
    return;
  }

  const subjects = AMS.getSubjects();
  const sub = subjects.find(s => s.id === subjectId);
  const resId = `res_${Date.now()}`;

  const newResource = {
    id: resId,
    title: title,
    subjectId: subjectId,
    subjectName: sub?.title || 'Subject',
    subjectCode: sub?.code || 'CS',
    type: type,
    link: link,
    teacherName: user.name,
    notes: notes,
    uploadedAt: new Date().toISOString().split('T')[0]
  };

  const resources = AMS.getResources();
  resources.unshift(newResource);
  AMS.saveResources(resources);

  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && firestoreDbInstance) {
    try {
      await firestoreDbInstance.collection('resources').doc(resId).set(newResource);
    } catch (e) {
      console.warn('Firestore resource sync notice:', e);
    }
  }

  showToast('Resource Shared!', `${title} is now visible in the repository.`, 'success');
  closeModal('modalUploadResource');
  event.target.reset();

  renderResourcesView(user);
}

// ============================================================================
// 10. MODAL CONTROLLERS & UTILITIES
// ============================================================================

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.style.display = 'none';
}

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.style.display = 'none';
  }
});

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// 11. THEME SWITCHER (Light / Dark Mode)
// ============================================================================

function initTheme() {
  const savedTheme = localStorage.getItem('tit_ams_theme') || 'light';
  applyTheme(savedTheme, false);
}

function applyTheme(theme, showNotice = true) {
  const icon = document.getElementById('themeToggleIcon');
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    if (icon) icon.className = 'fa-solid fa-sun';
    localStorage.setItem('tit_ams_theme', 'dark');
    if (showNotice) showToast('Dark Theme Active', 'Switched to dark mode.', 'info', 1800);
  } else {
    document.body.classList.remove('dark-theme');
    if (icon) icon.className = 'fa-solid fa-moon';
    localStorage.setItem('tit_ams_theme', 'light');
    if (showNotice) showToast('Light Theme Active', 'Switched to clean executive light mode.', 'info', 1800);
  }
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark-theme');
  applyTheme(isDark ? 'light' : 'dark', true);
}

function updateFirebaseStatusBadge() {
  const badge = document.getElementById('firebaseLiveBadge');
  if (!badge) return;
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
    badge.className = 'badge badge-success';
    badge.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Connected (${firebaseConfig.projectId})`;
    const cardHint = document.querySelector('.firebase-card .demo-hint');
    if (cardHint) {
      cardHint.innerHTML = `<strong>Active Cloud Sync:</strong> Connected to project <code>${firebaseConfig.projectId}</code>. User authentication and attendance records sync directly with Firebase.`;
    }
  } else {
    badge.className = 'badge badge-info';
    badge.innerHTML = '<i class="fa-solid fa-code"></i> Ready to Connect';
  }
}

// ============================================================================
// 12. BOOTSTRAP INITIALIZATION ON PAGE LOAD
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateFirebaseStatusBadge();
  onStudentProgramChange();

  const user = AMS.getCurrentUser();
  if (user) {
    initAppShell();
  } else {
    document.getElementById('authView').style.display = 'flex';
    document.getElementById('appShell').style.display = 'none';
    updateLoginRole('principal');
  }
});
