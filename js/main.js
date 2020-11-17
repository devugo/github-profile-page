//  Get Page data
const getData = async () => {
    let response = await fetch("https://api.github.com/graphql", {
        method: "POST", 
        headers: {
            Authorization: DEVUGOTK.replace('-', '')
        },
        body: JSON.stringify(
            {
                query: `
                    query {
                        viewer {
                            name
                            avatarUrl
                            bio
                            login
                            repositories(privacy:PUBLIC, last: 20) {
                                totalCount
                                nodes {
                                    name
                                    description
                                    descriptionHTML
                                    url
                                    viewerHasStarred
                                    forkCount
                                    isFork
                                    licenseInfo {
                                        name
                                    }
                                    watchers {
                                        totalCount
                                    }
                                    primaryLanguage{
                                        name
                                    }
                                    parent {
                                        name
                                        url
                                        nameWithOwner
                                        forkCount
                                        watchers {
                                            totalCount
                                        }
                                    }
                                    updatedAt
                                }
                            }
                        }
                    }
                `
            }
            
        ), 
    
    });
    let result = await response.json();

    if(result && result.data && result.data.viewer){
        processData(result.data.viewer);
    }
}; getData();


/**
 * Process data to mount on the DOM
 * 
 * @param result
**/
const processData = (result) => {

    processUser(result);
    processRepos(result.repositories);
}

const processRepos = (repositories) => {
    processPublicRepoCount(repositories.totalCount);

    composeRepoData(repositories.nodes);
}

/**
 * Prepare Repositories DOM elements
 **/
const composeRepoData = (repositories) => {
    let elements = '';
    for(var i = 0; i < repositories.length; i++){
        let repository = repositories[i];

        // console.log(repository);

        // TOtal number of watchers
        let totalStarCount = repository.watchers.totalCount;
        //  Total number of forks on repo
        let totalForkCount = repository.forkCount;

        //  Add parent's fork count if exists
        if(repository.parent != null){
            totalForkCount += repository.parent.forkCount;
        }

        let lastUpdated = formatUpdatedTime(repository.updatedAt);
        

        let element = 
            `<li class="repository pb-3 pt-3 border-bottom">
                <div class="brief">
                    <h3 class="title"><a href="${repository.url}">${repository.name}</a></h3>
                    ${repository.parent != null ? `<p class="forked mt-1"><span>Forked from <a href="${repository.parent.url}">${repository.parent.nameWithOwner}</a></span></p>` : ''}
                    <div class="description mt-1">${repository.descriptionHTML != null ? repository.descriptionHTML : ''}</div>
                    <div class="foot mt-1_5">
                        ${repository.primaryLanguage !== null ? `<span class="language"><span class="language-color" style="background-color: ${colors[repository.primaryLanguage.name].color}"></span> <span class="language-name">${repository.primaryLanguage.name}</span></span>`: ''}
                        ${totalStarCount != 0 ? `<a class="star"><svg aria-label="star" class="octicon octicon-star" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg><span class="star-count">${totalStarCount}</span></a>` : ''}
                        ${totalForkCount != 0 ? `<a class="fork"><svg aria-label="fork" class="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg><span class="fork-count">${totalForkCount}</span></a>` : ''}
                        ${repository.licenseInfo != null ? `<span class="license"><svg class="octicon octicon-law mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"></path></svg><span class="license-text">${repository.licenseInfo.name}</span></span>` : ''}
                        
                        <span class="time">
                            <relative-time datetime="${repository.updatedAt}" class="no-wrap" title="${lastUpdated}">${lastUpdated}</relative-time>
                        </span>
                    </div>
                </div>
                <button>
                    ${
                        repository.viewerHasStarred ?
                        '<svg class="octicon octicon-star-fill mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path></svg><span>Unstar</span>' :
                        '<svg class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg><span>Star</span>'
                    }
                    
                </button>
            </li>`;

            elements += element;
    }
    bindRepoData(elements)
    
}

/**
 * Bind repositpries data HTML to the DOM
 **/
const bindRepoData = (data) => {
    let reposTag = getById('repositories-panel__list');

    if(reposTag){
        reposTag.innerHTML = data;
    }
}

/**
 * Bind public repo count to DOM
 **/
const processPublicRepoCount = (count) => {
    //  Get the count tag
    let element = getById('public-repo__count');

    if(element){
        element.innerHTML = `<strong><span></span></strong>${count} results for <strong>public</strong> repositories`;
    }
}

/**
 * Bind all repo count to DOM
**/
const processAllRepoCount = (count) => {
    //  Get the count tag
    let element = getById('all-repo__count');

    if(element){
        element.textContent = count;
    }
}

const processUser = (data) => {
    processUsername(data.login);
    processName(data.name);
    processBio(data.bio);
    processAvatar(data.avatarUrl, data.login);
}

const processUsername = (username) => {
    //  Get all username tags
    let elements = getByClassName('bind-username');

    //  Loop through username tag to bind username value
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        //  Bind username to the DOM
        element.textContent = username;
    }
}

const processName = (name) => {
    //  Get the name tag
    let element = getById('bind-name');

    if(element){
        //  Bind name to the DOM
        element.textContent = name;
    }
}

const processBio = (bio) => {
        //  Get the bio tag
        let element = getById('bind-bio');

    if(element){
        //  Bind bio to the DOM
        element.textContent = bio;
    }
}

const processAvatar = (avatar, username) => {
        //  Get all avatar tags
        let elements = getByClassName('bind-avatar');

    //  Loop through avatar tag to bind avatar value
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        //  Bind avatar to the DOM
        element.src = avatar;
        element.alt = `@${username}`;
    }
}


const getTotalRepoCount = async () => {
    let response = await fetch("https://api.github.com/graphql", {
        method: "POST", 
        headers: {
            Authorization: DEVUGOTK.replace('-', '')
        },
        body: JSON.stringify(
            {
                query: `
                    query {
                        viewer {
                            repositories(last: 1) {
                                totalCount
                            }
                        }
                    }
                `
            }
            
        ), 
    
    });
    let result = await response.json();

    processAllRepoCount(result.data.viewer.repositories.totalCount);
}; getTotalRepoCount();