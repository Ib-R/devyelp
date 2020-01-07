const submit = async (e) => {
    const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMDQ5MDBmZDUyZGI5MzU3MDg3ZjdkZiIsImlhdCI6MTU3ODMwNjAwNCwiZXhwIjoxNTgwODk4MDA0fQ.3lBg9hLoRJWSH-VmEgXXYSvTguM5klYiJySaJsGj2_4';
    const nameInput = document.getElementById('name');
    let errorDiv = document.getElementById('error');

    if (typeof lat == 'undefined') {
        errorDiv.innerHTML = `<p class='error'>Please select location</p>`;
        return;
    }

    const data = {
        name: nameInput.value,
        desc: "ModernTech has one goal, and that is to make you a rockstar developer and/or designer with a six figure salary. We teach both development and UI/UX",
        website: "https://moderntech.com",
        phone: "(222) 222-2222",
        email: "enroll@moderntech.com",
        address: "220 Pawtucket St, Lowell, MA 01854",
        location: {
            coordinates: [lng, lat],
            formattedAddress: `${street} ${city}, ${state}`,
            street,
            city,
            state,
            country: country,
        },
        careers: ["Web Development", "UI/UX", "Mobile Development"],
        housing: false, "jobAssistance": true, jobGuarantee: false, acceptGi: true
    };
    var body = JSON.stringify(data);
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body,
        redirect: 'follow'
    };
    const response = await fetch("http://localhost:5000/api/v1/companies", requestOptions);
    const result = await response.json();

    if (result.error) {
        errorDiv.innerHTML = `<p class='error'>${result.error}</p>`;
    } else {
        // Reset fields
        errorDiv.innerHTML = '';
        nameInput.value = '';
    }
    console.log(result);
};