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


    experience
        .querySelector('[data-panel="tasks"]')
        .classList.add('active');

});