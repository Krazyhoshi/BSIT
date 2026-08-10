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
// GET NAME EXTENSION
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


        if (checkbox && checkbox.checked) {

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


            if (!checkbox) {
                return;
            }


            checkbox.addEventListener(
                "change",
                () => {

                    if (checkbox.checked) {

                        extensions.forEach(
                            (otherId) => {

                                if (otherId !== id) {

                                    const other =
                                        document.getElementById(
                                            otherId
                                        );


                                    if (other) {

                                        other.checked =
                                            false;

                                    }

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


    const extensionName =
        getNameExtension();


    const gender =
        document
            .getElementById("gender")
            .value;


    const birthday =
        document
            .getElementById("birthday")
            .value;


    const email =
        document
            .getElementById("email")
            .value
            .trim();


    const contactNumber =
        document
            .getElementById("contactNumber")
            .value
            .trim();


    const course =
        document
            .getElementById("course")
            .value;


    const year =
        document
            .getElementById("year")
            .value;


    // =====================================================
    // BASIC VALIDATION
    // =====================================================

    if (
        !firstName ||
        !lastName ||
        !gender ||
        !birthday ||
        !email ||
        !contactNumber ||
        !course ||
        !year
    ) {

        showToast(
            "Incomplete Form",
            "Please fill in all required fields.",
            "error"
        );

        return;

    }


    // =====================================================
    // GMAIL VALIDATION
    // =====================================================

    const gmailPattern =
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/;


    if (!gmailPattern.test(email)) {

        showToast(
            "Invalid Gmail",
            "Please enter a valid Gmail address ending in @gmail.com.",
            "error"
        );

        return;

    }


    // =====================================================
    // CONTACT NUMBER VALIDATION
    // =====================================================

    const phonePattern =
        /^09\d{9}$/;


    if (!phonePattern.test(contactNumber)) {

        showToast(
            "Invalid Contact Number",
            "Please enter an 11-digit Philippine number starting with 09.",
            "error"
        );

        return;

    }


    // =====================================================
    // LOADING
    // =====================================================

    setSubmitLoading(true);


    try {

        // =================================================
        // CHECK DUPLICATE EMAIL
        // =================================================

        const {
            data: existingEmail,
            error: duplicateError
        } = await supabaseClient
            .from("students")
            .select("email")
            .eq("email", email)
            .maybeSingle();


        if (duplicateError) {

            throw duplicateError;

        }


        if (existingEmail) {

            showToast(
                "Gmail Already Registered",
                "A student with this Gmail address is already registered.",
                "error"
            );

            return;

        }


        // =================================================
        // INSERT STUDENT
        // =================================================

        const {
            data,
            error
        } = await supabaseClient
            .from("students")
            .insert([
                {

                    last_name:
                        lastName,

                    first_name:
                        firstName,

                    middle_name:
                        middleName || null,

                    gender:
                        gender,

                    birthday:
                        birthday,

                    course:
                        course,

                    year:
                        year,

                    contact_number:
                        contactNumber,

                    email:
                        email,

                    extension_name:
                        extensionName || null

                }
            ])
            .select()
            .single();


        if (error) {

            throw error;

        }


        // =================================================
        // SUCCESS
        // =================================================

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


            if (checkbox) {

                checkbox.checked =
                    false;

            }

        }
    );

}


// =========================================================
// SUBMIT LOADING
// =========================================================

function setSubmitLoading(loading) {

    submitButton.disabled =
        loading;


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


        students =
            data || [];


        applyFiltersAndSort();

    }


    catch (error) {

        console.error(
            "Loading students error:",
            error
        );


        students = [];

        filteredStudents = [];


        studentsGrid.innerHTML = "";


        emptyState.classList.remove(
            "hidden"
        );


        emptyState.querySelector(
            "h3"
        ).textContent =
            "Unable to load students";


        emptyState.querySelector(
            "p"
        ).textContent =
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
// HIDE LOADING
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

    if (
        searchInput.value.trim()
    ) {

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
// FILTER + AUTOMATIC A-Z SORT
// =========================================================

function applyFiltersAndSort() {

    hideDirectoryLoading();


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    // =====================================================
    // FILTER
    // =====================================================

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


                const contact =
                    String(
                        student.contact_number || ""
                    ).toLowerCase();


                const course =
                    String(
                        student.course || ""
                    ).toLowerCase();


                const year =
                    String(
                        student.year || ""
                    ).toLowerCase();


                return (
                    fullName.includes(search) ||
                    email.includes(search) ||
                    contact.includes(search) ||
                    course.includes(search) ||
                    year.includes(search)
                );

            }
        );


    // =====================================================
    // ALWAYS SORT A-Z
    //
    // LAST NAME
    // FIRST NAME
    // EXTENSION
    // MIDDLE NAME
    // =====================================================

    filteredStudents.sort(
        compareStudents
    );


    renderStudents();

}


// =========================================================
// COMPARE STUDENTS
// =========================================================

function compareStudents(a, b) {

    // -----------------------------------------------------
    // LAST NAME
    // -----------------------------------------------------

    const lastNameComparison =
        compareText(
            a.last_name,
            b.last_name
        );


    if (lastNameComparison !== 0) {

        return lastNameComparison;

    }


    // -----------------------------------------------------
    // FIRST NAME
    // -----------------------------------------------------

    const firstNameComparison =
        compareText(
            a.first_name,
            b.first_name
        );


    if (firstNameComparison !== 0) {

        return firstNameComparison;

    }


    // -----------------------------------------------------
    // EXTENSION
    // -----------------------------------------------------

    const extensionComparison =
        compareText(
            a.extension_name,
            b.extension_name
        );


    if (extensionComparison !== 0) {

        return extensionComparison;

    }


    // -----------------------------------------------------
    // MIDDLE NAME
    // -----------------------------------------------------

    return compareText(
        a.middle_name,
        b.middle_name
    );

}


// =========================================================
// COMPARE TEXT
// =========================================================

function compareText(a, b) {

    const valueA =
        String(a || "")
            .trim();


    const valueB =
        String(b || "")
            .trim();


    return valueA.localeCompare(
        valueB,
        undefined,
        {
            sensitivity: "base"
        }
    );

}


// =========================================================
// RENDER STUDENTS
// =========================================================

function renderStudents() {

    hideDirectoryLoading();


    studentsGrid.innerHTML = "";


    updateStudentCount();


    if (
        filteredStudents.length === 0
    ) {

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
        document.createElement(
            "article"
        );


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
            student.created_at ||
            student.registered_at
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
                        Gmail
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
                    📱
                </div>

                <div class="info-text">

                    <span class="info-label">
                        Contact Number
                    </span>

                    <span class="info-value">
                        ${escapeHTML(
                            student.contact_number || "N/A"
                        )}
                    </span>

                </div>

            </div>


            <div class="info-row">

                <div class="info-icon">
                    👤
                </div>

                <div class="info-text">

                    <span class="info-label">
                        Gender
                    </span>

                    <span class="info-value">
                        ${escapeHTML(
                            student.gender || "N/A"
                        )}
                    </span>

                </div>

            </div>


            <div class="info-row">

                <div class="info-icon">
                    🎂
                </div>

                <div class="info-text">

                    <span class="info-label">
                        Birthday
                    </span>

                    <span class="info-value">
                        ${escapeHTML(
                            formatBirthday(
                                student.birthday
                            )
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
                            student.year || "N/A"
                        )}
                    </span>

                </div>

            </div>

        </div>


        <div class="registration-time">
            Registered: ${escapeHTML(
                registeredDate
            )}
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
            String(
                student.first_name
            ).trim()
        );

    }


    if (student.middle_name) {

        parts.push(
            String(
                student.middle_name
            ).trim()
        );

    }


    if (student.last_name) {

        parts.push(
            String(
                student.last_name
            ).trim()
        );

    }


    let name =
        parts.join(" ");


    if (student.extension_name) {

        name +=
            ` ${String(
                student.extension_name
            ).trim()}`;

    }


    return name ||
        "Unnamed Student";

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
// FORMAT BIRTHDAY
// =========================================================

function formatBirthday(value) {

    if (!value) {

        return "N/A";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "N/A";

    }


    return date.toLocaleDateString(
        "en-PH",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// =========================================================
// FORMAT REGISTRATION DATE
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

            showSection(
                "directory"
            );

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
        error.code === "23505"
    ) {

        return "This student information already exists.";

    }


    if (
        error.code === "42501"
    ) {

        return "Database permission denied. Check your Supabase RLS policies.";

    }


    if (
        error.code === "PGRST204"
    ) {

        return "A column used by the website does not exist in your Supabase students table.";

    }


    if (
        error.code === "23502"
    ) {

        return "A required database field is missing.";

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

    return String(
        value ?? ""
    )
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