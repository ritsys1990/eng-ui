const event = new Event("oneTrustActiveGroupChange");

function OptanonWrapper() {
    // Get initial OnetrustActiveGroups ids
    if (typeof OptanonWrapperCount == "undefined" || otIniGrps !== OnetrustActiveGroups) {
        otGetInitialGrps();
    }
    
    // Assign OnetrustActiveGroups to custom variable
    function otGetInitialGrps() {
        OptanonWrapperCount = '';
        otIniGrps = OnetrustActiveGroups;
    }
    //Delete cookies
    otDeleteCookie(otIniGrps);
    function otDeleteCookie(iniOptGrpId) {
        var otDomainGrps = JSON.parse(JSON.stringify(Optanon.GetDomainData().Groups));
        var otDeletedGrpIds = otGetInactiveId("," + otDomainGrps.map(x => x.OptanonGroupId).join() + ",", iniOptGrpId
        );
        if (otDeletedGrpIds?.length > 0 && otDomainGrps?.length > 0) {
            for (var i = 0; i < otDomainGrps.length; i++) {
                //Check if CustomGroupId matches
                if (otDomainGrps[i]?.['CustomGroupId'] != '' 
                    && otDeletedGrpIds.includes(otDomainGrps[i]?.['CustomGroupId']) 
                    && otDomainGrps[i]?.['Cookies']) {
                    const cookies = otDomainGrps[i]['Cookies'];

                    for (var j = 0; j < cookies.length; j++) {    
                        if (cookies[j]?.['Name']?.includes('[')) {
                            eraseDynamicallyNamedCookie(cookies[j]);
                        } else {
                            //Delete cookie
                            eraseCookie(cookies[j]?.['Name'], cookies[j]?.['Host']);
                        }
                    }
                }

                //Check if Hostid matches
                if (otDomainGrps[i]?.['Hosts']?.length > 0) {
                    const hosts = otDomainGrps[i]?.['Hosts'];

                    for (var j = 0; j < hosts.length; j++) {
                        //Check if HostId presents in the deleted list and cookie array is not blank
                        if (otDeletedGrpIds.includes(hosts?.[j]?.['HostId']) && hosts[j]?.['Cookies']?.length > 0) {
                            const hostCookies = hosts[j]['Cookies'];

                            for (var k = 0; k < hostCookies?.length; k++) {
                                if (hostCookies?.[k]?.['Name']?.includes('[')) {
                                    eraseDynamicallyNamedCookie(hostCookies?.[k]);
                                } else {
                                    //Delete cookie
                                    eraseCookie(hostCookies?.[k]?.['Name'], hostCookies?.[k]?.['Host']);
                                }
                            }
                        }
                    }
                }

            }
        }
        otGetInitialGrps(); //Reassign new group ids
    }

    //Get inactive ids
    function otGetInactiveId(customIniId, otActiveGrp) {
        //Initial OnetrustActiveGroups
        customIniId = customIniId?.split(",");
        customIniId = customIniId?.filter(Boolean);

        //After action OnetrustActiveGroups
        otActiveGrp = otActiveGrp?.split(",");
        otActiveGrp = otActiveGrp?.filter(Boolean);

        var result = [];
        for (const iniIds in customIniId) {
            if (!otActiveGrp.includes(iniIds)) {
                result.push(iniIds);
            }
        }
        return result;
    }

    function eraseDynamicallyNamedCookie(cookieFormat) {
        if (!cookieFormat) {
            return;
        }
        
        // we can improve this logic in the future by using Regular expressions, for now, the 
        // known dynamically-named cookies have a specific prefix always.
        const namePrefix = cookieFormat["Name"].split('[')[0];
        const host = cookieFormat['Host'];

        // if the name prefix is an empty string, we run the risk of deleting all cookies
        // an entering a crash loop, hence we make sure it isn't empty.
        if (namePrefix !== '') {
            document.cookie.split(';').forEach(cookie => 
                {
                    const fullName = cookie?.split('=')?.[0]?.trim();
                    if (fullName?.includes(namePrefix)) {
                        eraseCookie(fullName, host);
                    }
                });
        }
    }

    //Delete cookie
    function eraseCookie(name, cookieDomain) {
        if (!name || !cookieDomain) {
            return;
        }

        //Delete root path cookies
        domainName = window.location.hostname;
        document.cookie = name + '=; Max-Age=-99999999; Path=/;Domain=' + domainName;
        document.cookie = name + '=; Max-Age=-99999999; Path=/;Domain=' + cookieDomain;
        document.cookie = name + '=; Max-Age=-99999999; Path=/;';

        //Delete LSO incase LSO being used, cna be commented out.
        localStorage.removeItem(name);

        //Check for the current path of the page
        pathArray = window.location.pathname.split('/');
        //Loop through path hierarchy and delete potential cookies at each path.
        for (var i = 0; i < pathArray.length; i++) {
            if (pathArray[i]) {
                //Build the path string from the Path Array e.g /site/login
                var currentPath = pathArray.slice(0, i + 1).join('/');
                document.cookie = name + '=; Max-Age=-99999999; Path=' + currentPath + ';Domain=' + domainName;
                document.cookie = name + '=; Max-Age=-99999999; Path=' + currentPath + ';';
                //Maybe path has a trailing slash!
                document.cookie = name + '=; Max-Age=-99999999; Path=' + currentPath + '/;Domain=' + domainName;
                document.cookie = name + '=; Max-Age=-99999999; Path=' + currentPath + '/;';
            }
        }

    }

    if (OnetrustActiveGroups) {
        window.dispatchEvent(event);
    }
}