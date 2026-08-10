// =========================================================
// BSIT STUDENT SYSTEM
// STUDENT REGISTRATION + DIRECTORY
// =========================================================


// =========================================================
// GLOBAL VARIABLES
// =========================================================

let students = [];

let filteredStudents = [];


// =========================================================
// DOM ELEMENTS
// =========================================================

const studentForm =
    document.getElementById("studentForm");

const submitButton =
    document.getElementById("submitButton");

const submitText =
    document.getElementById("submitText");

const loadingSpinner =
    document.getElementById("loadingSpinner");

const registrationSection =
    document.getElementById("registrationSection");

const directorySection =
    document.getElementById("directorySection");

const registerNav =
    document.getElementById("registerNav");

const directoryNav =
    document.getElementById("directoryNav");

const studentsGrid =
    document.getElementById("studentsGrid");

const directoryLoading =
    document.getElementById("directoryLoading");

const emptyState =
    document.getElementById("emptyState");

const studentCount =
    document.getElementById("studentCount");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const refreshButton =
    document.getElementById("refreshButton");

const successModal =
    document.getElementById("successModal");

const modalClose =
    document.getElementById("modalClose");

const modalDirectoryButton =
    document.getElementById("modalDirectoryButton");

const registeredStudentName =
    document.getElementById("registeredStudentName");

const toast =
    document.getElementById("toast");

const toastIcon =
    document.getElementById("toastIcon");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");

const toastClose =
    document.getElementById("toastClose");


// =========================================================
// INITIALIZE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupNavigation();

        setupRegistrationForm();

        setupDirectoryControls();

        setupModal();

        setupExtensionCheckboxes();

        loadStudents();

    }
);


// =========================================================
// NAVIGATION
// =========================================================

function setupNavigation() {

    registerNav.addEventListener(
        "click",
        () => {

            showSection("register");

        }
    );


    directoryNav.addEventListener(
        "click",
        () => {

            showSection("directory");

        }
    );

}


// =========================================================
// SHOW SECTION
// =========================================================

function showSection(section) {

    if (section === "register") {

        registrationSection.classList.add(
            "active-section"
        );

        directorySection.classList.remove(
            "active-section"
        );

        registerNav.classList.add("active");

        directoryNav.classList.remove("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    if (section === "directory") {

        registrationSection.classList.remove(
            "active-section"
        );

        directorySection.classList.add(
            "active-section"
        );

        registerNav.classList.remove("active");

        directoryNav.classList.add("active");

        loadStudents();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

}


// =========================================================
// REGISTRATION FORM
// =========================================================

function setupRegistrationForm() {

    studentForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            await registerStudent();

        }
    );

}


// =========================================================
// GET EXTENSION
// =========================================================

function getNameExtension() {

    const extensions = [
        "jrExtension",
        "srExtension",
        "iiExtension",
        "iiiExtension"
    ];

    for (const id of extensions) {

        const checkbox =
            document.getElementById(id);

        if (checkbox.checked) {

            return checkbox.value;

        }

    }

    return "";

}


// =========================================================
// EXTENSION CHECKBOXES
// =========================================================

function setupExtensionCheckboxes() {

    const extensions = [
        "jrExtension",
        "srExtension",
        "iiExtension",
        "iiiExtension"
    ];

    extensions.forEach(
        (id) => {

            const checkbox =
                document.getElementById(id);

            checkbox.addEventListener(
                "change",
                () => {

                    if (checkbox.checked) {

                        extensions.forEach(
                            (otherId) => {

                                if (otherId !== id) {

                                    document.getElementById(
                                        otherId
                                    ).checked = false;

                                }

                            }
                        );

                    }

                }
            );

        }
    );

}


// =========================================================
// REGISTER STUDENT
// =========================================================

async function registerStudent() {

    const firstName =
        document
            .getElementById("firstName")
            .value
            .trim();

    const middleName =
        document
            .getElementById("middleName")
            .value
            .trim();

    const lastName =
        document
            .getElementById("lastName")
            .value
            .trim();

    const extension =
        getNameExtension();

    const email =
        document
            .getElementById("email")
            .value
            .trim();

    const course =
        document
            .getElementById("course")
            .value;

    const yearLevel =
        document
            .getElementById("yearLevel")
            .value;


    // -------------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------------

    if (
        !firstName ||
        !lastName ||
        !email ||
        !course ||
        !yearLevel
    ) {

        showToast(
            "Incomplete Form",
            "Please fill in all required fields.",
            "error"
        );

        return;

    }


    // -------------------------------------------------------
    // LOADING STATE
    // -------------------------------------------------------

    setSubmitLoading(true);


    try {

        // ---------------------------------------------------
        // INSERT STUDENT
        // ---------------------------------------------------

        const {
            data,
            error
        } = await supabaseClient
            .from("students")
            .insert([
                {
                    first_name: firstName,

                    middle_name:
                        middleName || null,

                    last_name: lastName,

                    extension:
                        extension || null,

                    email: email,

                    course: course,

                    year_level: yearLevel
                }
            ])
            .select()
            .single();


        if (error) {

            throw error;

        }


        // ---------------------------------------------------
        // SUCCESS
        // ---------------------------------------------------

        const fullName =
            buildFullName(data);

        registeredStudentName.textContent =
            fullName;

        showSuccessModal();

        studentForm.reset();

        resetExtensionCheckboxes();

        await loadStudents();

    }


    catch (error) {

        console.error(
            "Registration error:",
            error
        );

        showToast(
            "Registration Failed",
            getSupabaseErrorMessage(error),
            "error"
        );

    }


    finally {

        setSubmitLoading(false);

    }

}


// =========================================================
// RESET EXTENSIONS
// =========================================================

function resetExtensionCheckboxes() {

    document.getElementById(
        "jrExtension"
    ).checked = false;

    document.getElementById(
        "srExtension"
    ).checked = false;

    document.getElementById(
        "iiExtension"
    ).checked = false;

    document.getElementById(
        "iiiExtension"
    ).checked = false;

}


// =========================================================
// SUBMIT LOADING
// =========================================================

function setSubmitLoading(loading) {

    submitButton.disabled = loading;

    if (loading) {

        submitText.textContent =
            "Registering...";

        loadingSpinner.classList.add(
            "active"
        );

    } else {

        submitText.textContent =
            "Register Student";

        loadingSpinner.classList.remove(
            "active"
        );

    }

}


// =========================================================
// LOAD STUDENTS
// =========================================================

async function loadStudents() {

    showDirectoryLoading();

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("students")
            .select("*");


        if (error) {

            throw error;

        }


        students = data || [];

        applyFiltersAndSort();

    }


    catch (error) {

        console.error(
            "Loading students error:",
            error
        );

        students = [];

        filteredStudents = [];

        hideDirectoryLoading();

        studentsGrid.innerHTML = "";

        emptyState.classList.remove(
            "hidden"
        );

        emptyState.querySelector("h3").textContent =
            "Unable to load students";

        emptyState.querySelector("p").textContent =
            getSupabaseErrorMessage(error);

        updateStudentCount();

    }

}


// =========================================================
// DIRECTORY LOADING
// =========================================================

function showDirectoryLoading() {

    emptyState.classList.add(
        "hidden"
    );

    studentsGrid.innerHTML = "";

    studentsGrid.appendChild(
        directoryLoading
    );

    directoryLoading.style.display =
        "flex";

}


// =========================================================
// HIDE DIRECTORY LOADING
// =========================================================

function hideDirectoryLoading() {

    directoryLoading.style.display =
        "none";

}


// =========================================================
// DIRECTORY CONTROLS
// =========================================================

function setupDirectoryControls() {

    searchInput.addEventListener(
        "input",
        () => {

            updateSearchButton();

            applyFiltersAndSort();

        }
    );


    clearSearch.addEventListener(
        "click",
        () => {

            searchInput.value = "";

            updateSearchButton();

            applyFiltersAndSort();

            searchInput.focus();

        }
    );


    refreshButton.addEventListener(
        "click",
        async () => {

            refreshButton.classList.add(
                "refreshing"
            );

            await loadStudents();

            setTimeout(
                () => {

                    refreshButton.classList.remove(
                        "refreshing"
                    );

                },
                300
            );

        }
    );

}


// =========================================================
// SEARCH BUTTON
// =========================================================

function updateSearchButton() {

    if (searchInput.value.trim()) {

        clearSearch.classList.add(
            "visible"
        );

    } else {

        clearSearch.classList.remove(
            "visible"
        );

    }

}


// =========================================================
// FILTER + SORT
// =========================================================

function applyFiltersAndSort() {

    hideDirectoryLoading();

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    // -------------------------------------------------------
    // FILTER
    // -------------------------------------------------------

    filteredStudents =
        students.filter(
            (student) => {

                const fullName =
                    buildFullName(student)
                        .toLowerCase();

                const email =
                    String(
                        student.email || ""
                    ).toLowerCase();

                return (
                    fullName.includes(search) ||
                    email.includes(search)
                );

            }
        );


    // -------------------------------------------------------
    // AUTOMATIC A-Z SORT
    //
    // LAST NAME
    // FIRST NAME
    // EXTENSION
    // MIDDLE NAME
    // -------------------------------------------------------

    filteredStudents.sort(
        compareStudents
    );


    renderStudents();

}


// =========================================================
// COMPARE STUDENTS
// =========================================================

function compareStudents(a, b) {

    // -------------------------------------------------------
    // LAST NAME
    // -------------------------------------------------------

    const lastNameA =
        normalizeName(
            a.last_name
        );

    const lastNameB =
        normalizeName(
            b.last_name
        );

    const lastNameComparison =
        lastNameA.localeCompare(
            lastNameB,
            undefined,
            {
                sensitivity: "base"
            }
        );

    if (lastNameComparison !== 0) {

        return lastNameComparison;

    }


    // -------------------------------------------------------
    // FIRST NAME
    // -------------------------------------------------------

    const firstNameA =
        normalizeName(
            a.first_name
        );

    const firstNameB =
        normalizeName(
            b.first_name
        );

    const firstNameComparison =
        firstNameA.localeCompare(
            firstNameB,
            undefined,
            {
                sensitivity: "base"
            }
        );

    if (firstNameComparison !== 0) {

        return firstNameComparison;

    }


    // -------------------------------------------------------
    // EXTENSION
    // -------------------------------------------------------

    const extensionA =
        normalizeName(
            a.extension
        );

    const extensionB =
        normalizeName(
            b.extension
        );

    const extensionComparison =
        extensionA.localeCompare(
            extensionB,
            undefined,
            {
                sensitivity: "base"
            }
        );

    if (extensionComparison !== 0) {

        return extensionComparison;

    }


    // -------------------------------------------------------
    // MIDDLE NAME
    // -------------------------------------------------------

    const middleNameA =
        normalizeName(
            a.middle_name
        );

    const middleNameB =
        normalizeName(
            b.middle_name
        );

    return middleNameA.localeCompare(
        middleNameB,
        undefined,
        {
            sensitivity: "base"
        }
    );

}


// =========================================================
// NORMALIZE NAME
// =========================================================

function normalizeName(value) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase();

}


// =========================================================
// RENDER STUDENTS
// =========================================================

function renderStudents() {

    hideDirectoryLoading();

    studentsGrid.innerHTML = "";

    updateStudentCount();


    if (filteredStudents.length === 0) {

        emptyState.classList.remove(
            "hidden"
        );

        return;

    }


    emptyState.classList.add(
        "hidden"
    );


    filteredStudents.forEach(
        (student, index) => {

            const card =
                createStudentCard(
                    student,
                    index
                );

            studentsGrid.appendChild(
                card
            );

        }
    );

}


// =========================================================
// CREATE STUDENT CARD
// =========================================================

function createStudentCard(
    student,
    index
) {

    const card =
        document.createElement("article");

    card.className =
        "student-card";

    card.style.animationDelay =
        `${Math.min(index * 0.04, 0.4)}s`;


    const fullName =
        buildFullName(student);


    const initials =
        getInitials(
            student.first_name,
            student.last_name
        );


    const registeredDate =
        formatDate(
            student.registered_at ||
            student.created_at
        );


    card.innerHTML = `

        <div class="student-card-top">

            <div class="student-avatar">
                ${escapeHTML(initials)}
            </div>

            <div>

                <div class="student-name">
                    ${escapeHTML(fullName)}
                </div>

            </div>

        </div>


        <div class="student-info">

            <div class="info-row">

                <div class="info-icon">
                    ✉️
                </div>

                <div class="info-text">

                    <span class="info-label">
                        Email
                    </span>

                    <span class="info-value">
                        ${escapeHTML(
                            student.email || "N/A"
                        )}
                    </span>

                </div>

            </div>


            <div class="info-row">

                <div class="info-icon">
                    🎓
                </div>

                <div class="info-text">

                    <span class="info-label">
                        Course
                    </span>

                    <span class="info-value">
                        ${escapeHTML(
                            student.course || "N/A"
                        )}
                    </span>

                </div>

            </div>


            <div class="info-row">

                <div class="info-icon">
                    📚
                </div>

                <div class="info-text">

                    <span class="info-label">
                        Year Level
                    </span>

                    <span class="info-value">
                        ${escapeHTML(
                            student.year_level || "N/A"
                        )}
                    </span>

                </div>

            </div>

        </div>


        <div class="registration-time">
            Registered: ${escapeHTML(registeredDate)}
        </div>

    `;


    return card;

}


// =========================================================
// BUILD FULL NAME
// =========================================================

function buildFullName(student) {

    const parts = [];

    if (student.first_name) {

        parts.push(
            student.first_name
        );

    }

    if (student.middle_name) {

        parts.push(
            student.middle_name
        );

    }

    if (student.last_name) {

        parts.push(
            student.last_name
        );

    }


    let name =
        parts.join(" ");


    if (student.extension) {

        name +=
            ` ${student.extension}`;

    }


    return name || "Unnamed Student";

}


// =========================================================
// GET INITIALS
// =========================================================

function getInitials(
    firstName,
    lastName
) {

    const first =
        String(
            firstName || "?"
        ).trim();

    const last =
        String(
            lastName || "?"
        ).trim();


    return (
        first.charAt(0) +
        last.charAt(0)
    ).toUpperCase();

}


// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(value) {

    if (!value) {

        return "Unknown";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Unknown";

    }


    return date.toLocaleString(
        "en-PH",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


// =========================================================
// UPDATE STUDENT COUNT
// =========================================================

function updateStudentCount() {

    studentCount.textContent =
        filteredStudents.length;

}


// =========================================================
// SUCCESS MODAL
// =========================================================

function setupModal() {

    modalClose.addEventListener(
        "click",
        hideSuccessModal
    );


    modalDirectoryButton.addEventListener(
        "click",
        () => {

            hideSuccessModal();

            showSection("directory");

        }
    );


    successModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                successModal
            ) {

                hideSuccessModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                successModal.classList.contains(
                    "show"
                )
            ) {

                hideSuccessModal();

            }

        }
    );

}


// =========================================================
// SHOW SUCCESS MODAL
// =========================================================

function showSuccessModal() {

    successModal.classList.add(
        "show"
    );

    successModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


// =========================================================
// HIDE SUCCESS MODAL
// =========================================================

function hideSuccessModal() {

    successModal.classList.remove(
        "show"
    );

    successModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

}


// =========================================================
// TOAST
// =========================================================

function showToast(
    title,
    message,
    type = "success"
) {

    toastTitle.textContent =
        title;

    toastMessage.textContent =
        message;


    if (type === "error") {

        toast.classList.add(
            "error"
        );

        toastIcon.textContent =
            "!";

    } else {

        toast.classList.remove(
            "error"
        );

        toastIcon.textContent =
            "✓";

    }


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            4500
        );

}


// =========================================================
// CLOSE TOAST
// =========================================================

toastClose.addEventListener(
    "click",
    () => {

        toast.classList.remove(
            "show"
        );

    }
);


// =========================================================
// SUPABASE ERROR MESSAGE
// =========================================================

function getSupabaseErrorMessage(
    error
) {

    if (!error) {

        return "Something went wrong.";

    }


    if (
        error.code === "42501"
    ) {

        return "Database permission denied. Check your Supabase RLS policies.";

    }


    if (
        error.code === "23505"
    ) {

        return "This student information already exists.";

    }


    if (
        error.message
    ) {

        return error.message;

    }


    return "Something went wrong while communicating with Supabase.";

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}