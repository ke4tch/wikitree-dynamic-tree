export class Utils {
    static getCookie(name) {
        return WikiTreeAPI.cookie(name) || null;
    }

    static setCookie(name, value, options) {
        return WikiTreeAPI.cookie(name, value, options);
    }

    static hideShakingTree() {
        $("#tree").slideUp("fast");
    }

    /**
     * Append a gif of a shaking tree as an image with id 'tree' to the HTML element with the id given in containerId
     * if 'tree' element does not exist. Otherwise, show the image using the jQuery slieDown() method.
     * @param {*} containerId (Optional, default="view-container") The element to which the image should
     *            be appended if it does not already exist.
     *            time this method is called
     * @param {*} callback optional: the method to call once the slideDown is complete.
     *            This is useful if the action to be performed while showing the tree,
     *            can sometimes be very short and mey complete before the slideDown completes.
     */
    static showShakingTree(containerId, callback) {
        if ($("#tree").length) {
            $("#tree").slideDown("fast", "swing", callback);
        } else {
            const treeGIF = $("<img id='tree' src='./views/cc7/images/tree.gif'>");
            if (typeof containerId == "undefined") containerId = "view-container";
            treeGIF.appendTo(`#${containerId}`);
            $("#tree").css({
                "display": "block",
                "margin": "auto",
                "height": "50px",
                "width": "50px",
                "border-radius": "50%",
                "border": "3px solid forestgreen",
            });
            $("#tree").slideDown("fast", "swing", callback);
        }
    }

    // Convert a (numeric) date string of the form 'YYYY-MM-DD' into a JS Date object.
    // The string is allowed to be partial and my even be a WT decade like '1960s'
    // A year of '0000-00-00' will be converted to 9999-12-13 so that unknown dates,
    // when sorted, will be last.
    static dateObject(dateStr) {
        const parts = (dateStr || "9999-12-31").split("-");
        // Unknown year goes last
        if (parts[0] && parts[0] == 0) parts[0] = 9999;
        if (parts[1] && parts[1] > 0) parts[1] -= 1;
        if (parts.length == 1) {
            parts[1] = 0;
        }
        return new Date(...parts);
    }

    /**
     * Turn a wikitree Place into a location as per format string
     */
    static settingsStyleLocation(locString, formatString) {
        // take the locString as input, and break it up into parts, separated by commas
        // In an IDEAL world, the place name would be entered thusly:
        // TOWN , (optional COUNTY), PROVINCE or STATE or REGION NAME , COUNTRY
        // So we want the parts at locations 0 , N - 1, and N for Town, Region, Country respectively
        // IF there are < 3 parts, then we have to do some assumptions and rejiggering to supply the formatString with a plausible result

        if (formatString == "Full") {
            // there's no need for doing any parsing --> just return the whole kit and caboodle
            return locString;
        }
        if (!locString) {
            return "";
        }
        var parts = locString.split(",");
        if (parts.length == 1) {
            // there's no way to reformat/parse a single item location
            return locString;
        }

        let town = parts[0].trim();
        let country = parts[parts.length - 1].trim();
        let region = "";
        if (parts.length > 2) {
            region = parts[parts.length - 2].trim();
        }

        if (formatString == "Country") {
            // Specifically ignore United Kingdom and return the constituent country
            if (country == "United Kingdom" || country == "Great Britain") {
                return region ? region : town;
            }
            return country;
        } else if (formatString == "Region") {
            if (region > "") {
                return region;
            } else {
                return country;
            }
        } else if (formatString == "Town") {
            return town;
        } else if (formatString == "TownCountry") {
            return town + ", " + country;
        } else if (formatString == "RegionCountry") {
            if (region > "") {
                return region + ", " + country;
            } else {
                return town + ", " + country;
            }
        } else if (formatString == "TownRegion") {
            if (region > "") {
                return town + ", " + region;
            } else {
                return town + ", " + country;
            }
        }
        return "";
    }

    static chooseForeground(backgroundColour) {
        let backgroundHex = this.rgbToHex(backgroundColour);
        let relativeLuminance = this.getLuminance(backgroundHex);
        let chooseBlack = (relativeLuminance + 0.05) / 0.05;
        let chooseWhite = 1.05 / (relativeLuminance + 0.05);
        return chooseBlack > chooseWhite ? "#000000" : "#ffffff";
    }

    static getLuminance(colour) {
        colour = colour.replace(/#/, "").match(/.{1,2}/g);
        for (let x = 0; x < colour.length; x++) {
            colour[x] = parseInt(colour[x], 16) / 255;
            colour[x] = colour[x] <= 0.03928 ? colour[x] / 12.92 : ((colour[x] + 0.055) / 1.055) ** 2.4;
        }
        return 0.2126 * colour[0] + 0.7152 * colour[1] + 0.0722 * colour[2];
    }

    static componentToHex(c) {
        // This expects `c` to be a number:
        const hex = c.toString(16);

        return hex.length === 1 ? `0${hex}` : hex;
    }

    static rgbToHex(rgb) {
        // .map(Number) will convert each string to number:
        const [r, g, b] = rgb.replace("rgb(", "").replace(")", "").split(",").map(Number);

        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
}
