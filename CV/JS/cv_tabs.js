console.log("cv_tabs.js betöltve");

const template = document.querySelector("#experience-tabs-template");

console.log(template);

const tabContainers = document.querySelectorAll(".experience-tabs");

console.log(tabContainers);

tabContainers.forEach(container => {

    const clone = template.content.cloneNode(true);

    container.appendChild(clone);

});
document.querySelectorAll(".experience-item").forEach(experience => {

    const firstTab = experience.querySelector(".experience-tab");

    firstTab.classList.add("active");

    const firstPanel = experience.querySelector(

        `[data-panel="${firstTab.dataset.tab}"]`

    );

    firstPanel.classList.add("active");

});


document.querySelectorAll('.experience-item').forEach(experience => {

    const tabs = experience.querySelectorAll('.experience-tab');
    const panels = experience.querySelectorAll('.experience-panel');


    tabs.forEach(tab => {

        tab.addEventListener('click', () => {

            const selectedTab = tab.dataset.tab;


            tabs.forEach(button => {
                button.classList.remove('active');
            });


            panels.forEach(panel => {
                panel.classList.remove('active');
            });


            tab.classList.add('active');


            experience
                .querySelector(`[data-panel="${selectedTab}"]`)
                .classList.add('active');

        });

    });


});