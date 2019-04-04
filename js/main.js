let app = {} || app;
app.images = [];

app.animateCSS = (element, animationName, callback) => {
    const node = document.querySelector(element);
    node.classList.add('animated', animationName);

    handleAnimationEnd = () => {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

app.json = '';

app.userSelected = (email) => {
    const data = app.json;

    data.results.map(user => {
        if (user.email == email) {

            $('.mainImage').css('background-image', "url('" + app.images[user.login.uuid].src + "')");
            $('.secondaryImage').css('background-image', "url('" + app.images[user.login.uuid].src + "')");
            $('#userName').html(user.name.first + ' ' + user.name.last);
            $('#gender').html(user.gender);
            $('#email').html(email);
            $('#phone').html(user.phone);
            $('#location').html(user.location.street);
            $('#shortBio').html("I'm " + user.dob.age + " years old");
            app.animateCSS('.secondaryImage', 'pulse');
        }
    })

}

app.init = () => {
    const template = $('#listTemplate').html();
    Mustache.parse(template);

    $.ajax({
        url: 'https://randomuser.me/api/?results=18',
        dataType: 'json',
        beforeSend: () => {
            $('.loader').show();
        },
        success: (data) => {
            $('.loader').hide();
            app.json = data;
            const rendered = Mustache.render(template, data);
            $('#userList').html(rendered);
            app.animateCSS('#userList', 'fadeIn');

            let newImage;

            data.results.map(user => {
                newImage = new Image();
                newImage.src = user.picture.large;
                app.images[user.login.uuid] = newImage;
            })

        }
    });

    $('#select').on('change', (e, element) => {
        const gender = $('#select').val();

        app.json.results.map(user => {

            if (user.gender == gender || gender == 'all') {
                $('#' + user.login.uuid).show();
            } else {
                $('#' + user.login.uuid).hide();
            }
        });

    })

}

Zepto(($) => {
    app.init();
})