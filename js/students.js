let students = [];
let filteredStudents = [];

let directoryLoaded = false;
let isSwitchingSection = false;

let currentSection = "register";


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

const brandButton =
    document.getElementById("brandButton");

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

const sortSelect =
    document.getElementById("sortSelect");

const sortIcon =
    document.getElementById("sortIcon");

const sortTitle =
    document.getElementById("sortTitle");

const sortDescription =
    document.getElementById("sortDescription");

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

document.addEventListener("DOMContentLoaded", () => {

    setupNavigation();

    setupRegistrationForm();

    setupDirectoryControls();

    setupModal();

    setupExtensionCheckboxes();

    setupInputFormatting();

    showSection("register", false);

});


// =========================================================
// NAVIGATION
// =========================================================

function setupNavigation() {

    registerNav.addEventListener("click", () => {

        showSection("register");

    });


    directoryNav.addEventListener("click", () => {

        showSection("directory");

    });


    brandButton.addEventListener("click", () => {

        showSection("register");

    });

}


async function showSection(
    section,
    shouldScroll = true
) {

    if (section === currentSection) {

        if (
            section === "directory" &&
            !directoryLoaded
        ) {

            await loadStudents();

        }

        return;

    }


    if (isSwitchingSection) {
        return;
    }


    isSwitchingSection = true;


    const oldSection =
        currentSection === "register"
            ? registrationSection
            : directorySection;


    const newSection =
        section === "register"
            ? registrationSection
            : directorySection;


    updateNavigation(section);


    oldSection.classList.remove(
        "section-enter"
    );

    oldSection.classList.add(
        "section-exit"
    );


    await wait(180);


    oldSection.classList.remove(
        "active-section",
        "section-exit"
    );


    newSection.classList.add(
        "active-section"
    );


    void newSection.offsetWidth;


    newSection.classList.add(
        "section-enter"
    );


    currentSection = section;


    if (
        section === "directory" &&
        !directoryLoaded
    ) {

        await loadStudents();

    }


    if (shouldScroll) {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    await wait(320);


    newSection.classList.remove(
        "section-enter"
    );


    isSwitchingSection = false;

}


function updateNavigation(section) {

    const registerActive =
        section === "register";

    registerNav.classList.toggle(
        "active",
        registerActive
    );

    directoryNav.classList.toggle(
        "active",
        !registerActive
    );

    registerNav.setAttribute(
        "aria-current",
        registerActive
            ? "page"
            : "false"
    );

    directoryNav.setAttribute(
        "aria-current",
        !registerActive
            ? "page"
            : "false"
    );

}


function wait(milliseconds) {

    return new Promise(resolve => {

        setTimeout(
            resolve,
            milliseconds
        );

    });

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
// INPUT FORMATTING
// =========================================================

function setupInputFormatting() {

    const contactInput =
        document.getElementById(
            "contactNumber"
        );


    contactInput.addEventListener(
        "input",
        () => {

            contactInput.value =
                contactInput.value
                    .replace(/\D/g, "")
                    .slice(0, 11);

        }
    );

}


// =========================================================
// EXTENSION
// =========================================================

function setupExtensionCheckboxes() {

    const ids = [
        "jrExtension",
        "srExtension",
        "iiExtension",
        "iiiExtension"
    ];


    ids.forEach(id => {

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


                ids.forEach(otherId => {

                    if (otherId === id) {
                        return;
                    }


                    const other =
                        document.getElementById(
                            otherId
                        );


                    if (other) {
                        other.checked = false;
                    }

                });

            }
        );

    });

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


        if (
            checkbox &&
            checkbox.checked
        ) {

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
    ].forEach(id => {

        const checkbox =
            document.getElementById(id);


        if (checkbox) {
            checkbox.checked = false;
        }

    });

}


// =========================================================
// REGISTER STUDENT
// =========================================================

async function registerStudent() {

    const firstName =
        document.getElementById(
            "firstName"
        ).value.trim();


    const middleName =
        document.getElementById(
            "middleName"
        ).value.trim();


    const lastName =
        document.getElementById(
            "lastName"
        ).value.trim();


    const gender =
        document.getElementById(
            "gender"
        ).value;


    const birthday =
        document.getElementById(
            "birthday"
        ).value;


    const course =
        document.getElementById(
            "course"
        ).value;


    const year =
        document.getElementById(
            "year"
        ).value;


    const contactNumber =
        document.getElementById(
            "contactNumber"
        ).value.trim();


    const email =
        document.getElementById(
            "email"
        ).value.trim();


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


        // =================================================
        // UPDATE LOCAL DATA SAFELY
        // =================================================

        if (data) {

            const existingIndex =
                students.findIndex(
                    student =>
                        student.id === data.id
                );


            if (existingIndex >= 0) {

                students[
                    existingIndex
                ] = data;

            } else {

                students.push(data);

            }

        }


        registeredStudentName.textContent =
            buildFullName(data);


        showSuccessModal();


        studentForm.reset();

        resetExtensionCheckboxes();


        // Re-render only if directory
        // has already been loaded.

        if (directoryLoaded) {

            applyFiltersAndSort();

        }

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
// SUBMIT LOADING
// =========================================================

function setSubmitLoading(
    loading
) {

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


        directoryLoaded = true;


        applyFiltersAndSort();

    }


    catch (error) {

        console.error(
            "Directory loading error:",
            error
        );


        students = [];

        filteredStudents = [];

        directoryLoaded = false;


        hideDirectoryLoading();


        studentsGrid.innerHTML = "";


        emptyState.classList.remove(
            "hidden"
        );


        const title =
            emptyState.querySelector(
                "h3"
            );

        const description =
            emptyState.querySelector(
                "p"
            );


        title.textContent =
            "Unable to load students";


        description.textContent =
            getSupabaseErrorMessage(
                error
            );


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

            updateSortStatus();

            applyFiltersAndSort();

        }
    );


    refreshButton.addEventListener(
        "click",
        async () => {

            if (
                refreshButton.classList.contains(
                    "refreshing"
                )
            ) {

                return;

            }


            refreshButton.classList.add(
                "refreshing"
            );


            await loadStudents();


            setTimeout(() => {

                refreshButton.classList.remove(
                    "refreshing"
                );

            }, 250);

        }
    );


    updateSortStatus();

}


function updateSearchButton() {

    clearSearch.classList.toggle(
        "visible",
        Boolean(
            searchInput.value.trim()
        )
    );

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
                    fullName.includes(
                        search
                    ) ||
                    email.includes(
                        search
                    ) ||
                    course.includes(
                        search
                    ) ||
                    contact.includes(
                        search
                    ) ||
                    year.includes(
                        search
                    )
                );

            }
        );


    sortStudents(
        filteredStudents,
        sortSelect.value
    );


    renderStudents();

}


// =========================================================
// SORT
// =========================================================

function sortStudents(
    list,
    sortType
) {

    list.sort(
        (a, b) => {

            switch (sortType) {

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
                    compareStudentNames(
                        a,
                        b
                    );


                case "name-asc":

                default:

                    return (
                        compareStudentNames(
                            a,
                            b
                        )
                    );

            }

        }
    );

}


function compareStudentNames(
    a,
    b
) {

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


function compareNamePart(
    a,
    b
) {

    return String(a || "")
        .trim()
        .localeCompare(
            String(b || "")
                .trim(),
            undefined,
            {
                sensitivity: "base"
            }
        );

}


function getYearNumber(
    year
) {

    const value =
        String(
            year || ""
        ).toLowerCase();


    if (
        value.includes("1st") ||
        value.includes("first")
    ) {
        return 1;
    }


    if (
        value.includes("2nd") ||
        value.includes("second")
    ) {
        return 2;
    }


    if (
        value.includes("3rd") ||
        value.includes("third")
    ) {
        return 3;
    }


    if (
        value.includes("4th") ||
        value.includes("fourth")
    ) {
        return 4;
    }


    return 999;

}


// =========================================================
// TIMESTAMP
// =========================================================

function getTimestamp(
    student
) {

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


// =========================================================
// SORT STATUS
// =========================================================

function updateSortStatus() {

    const sortType =
        sortSelect.value;


    const statuses = {

        "name-asc": {

            icon: "A–Z",

            title:
                "Alphabetical order",

            description:
                "Last Name → First Name → Extension → Middle Name"

        },

        "name-desc": {

            icon: "Z–A",

            title:
                "Reverse alphabetical order",

            description:
                "Students are shown from Z to A"

        },

        "newest": {

            icon: "NEW",

            title:
                "Newest registrations",

            description:
                "Most recently registered students first"

        },

        "oldest": {

            icon: "OLD",

            title:
                "Oldest registrations",

            description:
                "Earliest registered students first"

        },

        "year-asc": {

            icon: "YR",

            title:
                "Year level",

            description:
                "1st Year → 2nd Year → 3rd Year → 4th Year"

        }

    };


    const status =
        statuses[sortType] ||
        statuses["name-asc"];


    sortIcon.textContent =
        status.icon;


    sortTitle.textContent =
        status.title;


    sortDescription.textContent =
        status.description;

}


// =========================================================
// RENDER
// =========================================================

function renderStudents() {

    hideDirectoryLoading();


    studentsGrid.innerHTML = "";


    updateStudentCount();

    updateDirectoryStats();


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
            index * 0.035,
            0.3
        )}s`;


    const fullName =
        buildFullName(
            student
        );


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
                            student.email ||
                            "N/A"
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
                            student.course ||
                            "N/A"
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
                            student.year ||
                            "N/A"
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
// NAME
// =========================================================

function buildFullName(
    student
) {

    if (!student) {
        return "Unnamed Student";
    }


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

        return (
            `${lastName}, ${rest}`
        );

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

function formatDate(
    value
) {

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
// DIRECTORY STATS
// =========================================================

function updateDirectoryStats() {

    totalStudents.textContent =
        students.length;


    bsitStudents.textContent =
        students.filter(
            student =>
                String(
                    student.course || ""
                )
                    .toUpperCase()
                    === "BSIT"
        ).length;


    if (!students.length) {

        latestRegistration.textContent =
            "—";

        return;

    }


    const latest =
        [...students]
            .sort(
                (
                    a,
                    b
                ) =>
                    getTimestamp(b) -
                    getTimestamp(a)
            )[0];


    const timestamp =
        getTimestamp(latest);


    if (!timestamp) {

        latestRegistration.textContent =
            "—";

        return;

    }


    latestRegistration.textContent =
        new Date(
            timestamp
        ).toLocaleDateString(
            "en-PH",
            {
                month: "short",
                day: "numeric"
            }
        );

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
        async () => {

            hideSuccessModal();

            await wait(120);

            await showSection(
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

        return (
            "Something went wrong."
        );

    }


    if (
        error.code === "23505"
    ) {

        return (
            "This student information already exists."
        );

    }


    if (
        error.code === "42501"
    ) {

        return (
            "Database permission denied. Check your Supabase RLS policies."
        );

    }


    if (
        error.code === "PGRST204"
    ) {

        return (
            "A database column used by the system does not exist. Please check your Supabase table columns."
        );

    }


    if (error.message) {

        return error.message;

    }


    return (
        "Something went wrong while communicating with Supabase."
    );

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHTML(
    value
) {

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
