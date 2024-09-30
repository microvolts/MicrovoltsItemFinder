let items = [];
let icons = [];

async function loadJSONFiles() {
    const itemResponse = await fetch('items.json');
    items = await itemResponse.json();

    const iconResponse = await fetch('icons.json');
    icons = await iconResponse.json();

    displayItems(items);
}

function displayItems(filteredItems) {
    const uniqueItems = {};
    
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';

    filteredItems.forEach(item => {
        const key = item.ii_iconsmall;

        if (!uniqueItems[key]) {
            uniqueItems[key] = {
                ii_name: item.ii_name,
                ii_desc: item.ii_desc,
                ii_iconsmall: item.ii_iconsmall,
                ii_id_list: []
            };
        }

        uniqueItems[key].ii_id_list.push(`${item.ii_id}`);
    });

    const itemList = Object.values(uniqueItems);

    itemList.forEach(item => {
        const iconData = icons.find(icon => icon.ii_id === item.ii_iconsmall);

        if (!iconData) {
            console.error(`No icon found for item with ii_iconsmall: ${item.ii_iconsmall}`);
            return;
        }

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        
        const img = document.createElement('img');
        img.src = `icons/${iconData.ii_filename.replace('.dds', '.png')}`;

        img.style.width = `${iconData.ii_width}px`;
        img.style.height = `${iconData.ii_height}px`;

        const offsetX = -(Math.floor(iconData.ii_offset % 5) * iconData.ii_width);
        const offsetY = -(Math.floor(iconData.ii_offset / 5) * iconData.ii_height);
        img.style.objectFit = 'none';
        img.style.objectPosition = `${offsetX}px ${offsetY}px`;
        img.style.clip = `rect(0px, ${iconData.ii_width}px, ${iconData.ii_height}px, 0px)`;

        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = `<strong>${item.ii_name}</strong><br>${item.ii_desc}<br>IDs: ${item.ii_id_list.join(', ')}`;
        
        itemDiv.appendChild(img);
        itemDiv.appendChild(infoDiv);
        container.appendChild(itemDiv);
    });
}

function filterItems() {
    const typeFilter = document.getElementById('typeFilter').value;

    const filteredItems = items.filter(item => {
        return typeFilter ? item.ii_type_inven == typeFilter : true;
    });

    displayItems(filteredItems);
}

window.onload = loadJSONFiles;