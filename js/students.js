let students = [];
let filteredStudents = [];

let currentSort = "name-asc";
let isSwitchingSection = false;


// =========================================================
// DOM
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

const totalStudents =
    document.getElementById("totalStudents");

const bsitStudents =
    document.getElementById("bsitStudents");

const latestRegistration =
    document.getElementById("latestRegistration");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const refreshButton =
    document.getElementById("refreshButton");

const sortSelect =
    document.getElementById("sortSelect");

const sortIcon =
    document.getElementById("sortIcon");

const sortTitle =
    document.getElementById("sortTitle");

const sortDescription =
    document.getElementById("sortDescription");

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

        updateSortBanner();

        showSection(
            "register",
            false
        );

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
// SECTION SWITCHING
// =========================================================

function showSection(
    section,
    shouldScroll = true
) {

    if (isSwitchingSection) {
        return;
    }


    const targetSection =
        section === "directory"
            ? directorySection
            : registrationSection;

    const otherSection =
        section === "directory"
            ? registrationSection
            : directorySection;


    if (
        targetSection.classList.contains(
            "active-section"
        )
    ) {

        if (
            section === "directory" &&
            shouldScroll
        ) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

        return;

    }


    isSwitchingSection = true;


    // -----------------------------------------
    // NAV ACTIVE STATE
    // -----------------------------------------

    registerNav.classList.toggle(
        "active",
        section === "register"
    );

    directoryNav.classList.toggle(
        "active",
        section === "directory"
    );


    registerNav.setAttribute(
        "aria-selected",
        String(section === "register")
    );

    directoryNav.setAttribute(
        "aria-selected",
        String(section === "directory")
    );


    // -----------------------------------------
    // PREPARE TARGET
    // -----------------------------------------

    targetSection.classList.add(
        "active-section"
    );

    targetSection.classList.remove(
        "section-enter"
    );


    // Force browser to notice removal
    // before starting animation again.

    void targetSection.offsetWidth;


    targetSection.classList.add(
        "section-enter"
    );


    targetSection.setAttribute(
        "aria-hidden",
        "false"
    );


    otherSection.classList.remove(
        "active-section"
    );

    otherSection.classList.remove(
        "section-enter"
    );

    otherSection.setAttribute(
        "aria-hidden",
        "true"
    );


    // -----------------------------------------
    // DIRECTORY LOAD
    // -----------------------------------------

    if (
        section === "directory"
    ) {

        loadStudents();

    }


    // -----------------------------------------
    // SCROLL
    // -----------------------------------------

    if (shouldScroll) {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // -----------------------------------------
    // FINISH
    // -----------------------------------------

    setTimeout(
        () => {

            targetSection.classList.remove(
                "section-enter"
            );

            isSwitchingSection = false;

        },
        450
    );

}


// =========================================================
// REGISTRATION
// =========================================================

function setupRegistrationForm() {

    studentForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await registerStudent();

        }
    );

}


// =========================================================
// EXTENSIONS
// =========================================================

function setupExtensionCheckboxes() {

    const ids = [
        "jrExtension",
        "srExtension",
        "iiExtension",
        "iiiExtension"
    ];


    ids.forEach(
        id => {

            const checkbox =
                document.getElementById(id);


            if (!checkbox) {
                return;
            }


            checkbox.addEventListener(
                "change",
                () => {

                    if (!checkbox.checked) {
                        return;
                    }


                    ids.forEach(
                        otherId => {

                            if (
                                otherId === id
                            ) {
                                return;
                            }


                            const other =
                                document.getElementById(
                                    otherId
                                );


                            if (other) {
                                other.checked = false;
                            }

                        }
                    );

                }
            );

        }
    );

}


function getNameExtension() {

    const ids = [
        "jrExtension",
        "srExtension",
        "iiExtension",
        "iiiExtension"
    ];


    for (const id of ids) {

        const checkbox =
            document.getElementById(id);


        if (checkbox?.checked) {
            return checkbox.value;
        }

    }


    return "";
}


function resetExtensionCheckboxes() {

    [
        "jrExtension",
        "srExtension",
        "iiExtension",
        "iiiExtension"
    ].forEach(
        id => {

            const checkbox =
                document.getElementById(id);


            if (checkbox) {
                checkbox.checked = false;
            }

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


    const gender =
        document
            .getElementById("gender")
            .value
            .trim();


    const birthday =
        document
            .getElementById("birthday")
            .value
            .trim();


    const course =
        document
            .getElementById("course")
            .value;


    const year =
        document
            .getElementById("year")
            .value
            .trim();


    const contactNumber =
        document
            .getElementById("contactNumber")
            .value
            .trim();


    const email =
        document
            .getElementById("email")
            .value
            .trim();


    const extension =
        getNameExtension();


    // =====================================================
    // VALIDATION
    // =====================================================

    if (
        !firstName ||
        !lastName ||
        !gender ||
        !birthday ||
        !course ||
        !year ||
        !contactNumber ||
        !email
    ) {

        showToast(
            "Incomplete Form",
            "Please fill in all required fields.",
            "error"
        );

        return;

    }


    if (
        !email
            .toLowerCase()
            .endsWith("@gmail.com")
    ) {

        showToast(
            "Invalid Gmail",
            "Please use a valid Gmail address.",
            "error"
        );

        return;

    }


    if (
        !/^09\d{9}$/.test(
            contactNumber
        )
    ) {

        showToast(
            "Invalid Contact Number",
            "Use the format 09XXXXXXXXX.",
            "error"
        );

        return;

    }


    setSubmitLoading(true);


    try {

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
                        extension || null

                }
            ])
            .select()
            .single();


        if (error) {
            throw error;
        }


        registeredStudentName.textContent =
            buildFullName(data);


        showSuccessModal();


        studentForm.reset();

        resetExtensionCheckboxes();


        // Add the newly registered student
        // to the local list.

        if (data) {

            students.push(data);

            applyFiltersAndSort();

        }

    }


    catch (error) {

        console.error(error);


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
            Array.isArray(data)
                ? data
                : [];


        updateDirectoryStats();

        applyFiltersAndSort();

    }


    catch (error) {

        console.error(error);


        students = [];

        filteredStudents = [];


        hideDirectoryLoading();


        studentsGrid.innerHTML = "";


        emptyState.classList.remove(
            "hidden"
        );


        emptyState
            .querySelector("h3")
            .textContent =
                "Unable to load students";


        emptyState
            .querySelector("p")
            .textContent =
                getSupabaseErrorMessage(error);


        updateStudentCount();

        updateDirectoryStats();

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


    sortSelect.addEventListener(
        "change",
        () => {

            currentSort =
                sortSelect.value;

            updateSortBanner();

            applyFiltersAndSort();

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
// FILTER + SORT
// =========================================================

function applyFiltersAndSort() {

    hideDirectoryLoading();


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    filteredStudents =
        students.filter(
            student => {

                const fullName =
                    buildFullName(
                        student
                    ).toLowerCase();


                const email =
                    String(
                        student.email || ""
                    ).toLowerCase();


                const course =
                    String(
                        student.course || ""
                    ).toLowerCase();


                const contact =
                    String(
                        student.contact_number || ""
                    ).toLowerCase();


                const year =
                    String(
                        student.year || ""
                    ).toLowerCase();


                return (
                    fullName.includes(search) ||
                    email.includes(search) ||
                    course.includes(search) ||
                    contact.includes(search) ||
                    year.includes(search)
                );

            }
        );


    filteredStudents.sort(
        compareStudents
    );


    renderStudents();

}


// =========================================================
// SORTING
// =========================================================

function compareStudents(a, b) {

    switch (currentSort) {

        case "name-desc":

            return (
                compareStudentNames(
                    b,
                    a
                )
            );


        case "newest":

            return (
                getTimestamp(b) -
                getTimestamp(a)
            );


        case "oldest":

            return (
                getTimestamp(a) -
                getTimestamp(b)
            );


        case "year-asc":

            return (
                getYearNumber(a.year) -
                getYearNumber(b.year)
            ) ||
            compareStudentNames(a, b);


        case "name-asc":
        default:

            return compareStudentNames(
                a,
                b
            );

    }

}


function getTimestamp(student) {

    const value =
        student.registered_at ||
        student.created_at ||
        student.inserted_at;


    if (!value) {
        return 0;
    }


    const timestamp =
        new Date(value).getTime();


    return Number.isNaN(timestamp)
        ? 0
        : timestamp;

}


function getYearNumber(year) {

    const value =
        String(year || "")
            .toLowerCase();


    if (
        value.includes("1st")
    ) {
        return 1;
    }

    if (
        value.includes("2nd")
    ) {
        return 2;
    }

    if (
        value.includes("3rd")
    ) {
        return 3;
    }

    if (
        value.includes("4th")
    ) {
        return 4;
    }


    return 99;

}


function compareStudentNames(a, b) {

    let result =
        compareNamePart(
            a.last_name,
            b.last_name
        );


    if (result !== 0) {
        return result;
    }


    result =
        compareNamePart(
            a.first_name,
            b.first_name
        );


    if (result !== 0) {
        return result;
    }


    result =
        compareNamePart(
            a.extension_name,
            b.extension_name
        );


    if (result !== 0) {
        return result;
    }


    return compareNamePart(
        a.middle_name,
        b.middle_name
    );

}


function compareNamePart(a, b) {

    return String(a || "")
        .trim()
        .toLowerCase()
        .localeCompare(
            String(b || "")
                .trim()
                .toLowerCase(),
            undefined,
            {
                sensitivity: "base"
            }
        );

}


// =========================================================
// SORT BANNER
// =========================================================

function updateSortBanner() {

    const settings = {

        "name-asc": {
            icon: "A–Z",
            title: "Alphabetical order",
            description:
                "Last Name → First Name → Extension → Middle Name"
        },

        "name-desc": {
            icon: "Z–A",
            title: "Reverse alphabetical order",
            description:
                "Students are shown from Z to A."
        },

        "newest": {
            icon: "NEW",
            title: "Newest registrations",
            description:
                "Most recently registered students appear first."
        },

        "oldest": {
            icon: "OLD",
            title: "Oldest registrations",
            description:
                "Earliest registered students appear first."
        },

        "year-asc": {
            icon: "YEAR",
            title: "Year level",
            description:
                "1st Year → 2nd Year → 3rd Year → 4th Year"
        }

    };


    const selected =
        settings[currentSort] ||
        settings["name-asc"];


    sortIcon.textContent =
        selected.icon;


    sortTitle.textContent =
        selected.title;


    sortDescription.textContent =
        selected.description;

}


// =========================================================
// RENDER STUDENTS
// =========================================================

function renderStudents() {

    hideDirectoryLoading();


    studentsGrid.innerHTML = "";


    updateStudentCount();


    if (!filteredStudents.length) {

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
// STUDENT CARD
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
        `${Math.min(
            index * 0.04,
            0.4
        )}s`;


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
            student.created_at ||
            student.inserted_at
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
                            student.year || "N/A"
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
                        Contact
                    </span>

                    <span class="info-value">
                        ${escapeHTML(
                            student.contact_number ||
                            "N/A"
                        )}
                    </span>

                </div>

            </div>

        </div>


        <div class="registration-time">
            Registered:
            ${escapeHTML(registeredDate)}
        </div>

    `;


    return card;

}


// =========================================================
// DIRECTORY STATS
// =========================================================

function updateDirectoryStats() {

    if (totalStudents) {

        totalStudents.textContent =
            students.length;

    }


    if (bsitStudents) {

        bsitStudents.textContent =
            students.filter(
                student =>
                    String(
                        student.course || ""
                    ).toUpperCase() ===
                    "BSIT"
            ).length;

    }


    if (
        latestRegistration
    ) {

        const latest =
            [...students]
                .sort(
                    (a, b) =>
                        getTimestamp(b) -
                        getTimestamp(a)
                )[0];


        latestRegistration.textContent =
            latest
                ? formatShortDate(
                    getTimestamp(latest)
                )
                : "—";

    }

}


function formatShortDate(timestamp) {

    if (!timestamp) {
        return "—";
    }


    const date =
        new Date(timestamp);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }


    return date.toLocaleDateString(
        "en-PH",
        {
            month: "short",
            day: "numeric"
        }
    );

}


// =========================================================
// NAME
// =========================================================

function buildFullName(student) {

    const lastName =
        String(
            student.last_name || ""
        ).trim();


    const firstName =
        String(
            student.first_name || ""
        ).trim();


    const middleName =
        String(
            student.middle_name || ""
        ).trim();


    const extension =
        String(
            student.extension_name || ""
        ).trim();


    const rest = [
        firstName,
        middleName,
        extension
    ]
        .filter(Boolean)
        .join(" ");


    if (
        lastName &&
        rest
    ) {
        return `${lastName}, ${rest}`;
    }


    if (lastName) {
        return lastName;
    }


    if (rest) {
        return rest;
    }


    return "Unnamed Student";

}


// =========================================================
// INITIALS
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
// DATE
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
// COUNT
// =========================================================

function updateStudentCount() {

    studentCount.textContent =
        filteredStudents.length;

}


// =========================================================
// MODAL
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
        event => {

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
        event => {

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


    if (
        type === "error"
    ) {

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
// TOAST CLOSE
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
// SUPABASE ERROR
// =========================================================

function getSupabaseErrorMessage(
    error
) {

    if (!error) {
        return "Something went wrong.";
    }


    if (
        error.code ===
        "23505"
    ) {

        return "This student information already exists.";

    }


    if (
        error.code ===
        "42501"
    ) {

        return "Database permission denied. Check your Supabase RLS policies.";

    }


    if (
        error.code ===
        "PGRST204"
    ) {

        return (
            "A database column used by the system does not exist. " +
            "Please check your Supabase table columns."
        );

    }


    if (error.message) {
        return error.message;
    }


    return (
        "Something went wrong while " +
        "communicating with Supabase."
    );

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