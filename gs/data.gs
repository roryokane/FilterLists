function refreshData() {
    var data = ImportJSON("https://raw.githubusercontent.com/collinbarrett/FilterLists/master/json-data/filterlists.json", "", "noTruncate,rawHeaders,noInherit");
    data = fill2dJsonArrayWithNulls(data);
    sData.clearContents();
    sData.getRange(1, 1, data.length, data[0].length).setValues(data);
    concatenateNamelessComboLists();
    sData.getRange(2, 1, data.length, data[0].length).sort(1);
    refreshParsed();
    refreshPublic();
}

function concatenateNamelessComboLists() {
    var numLists = getNumLists(sData);
    var listColumnIndex = getColIndexNum(sData, "list");
    var listData = sData.getRange(2, listColumnIndex, numLists, 1).getValues();
    var relatedColumnIndex = getColIndexNum(sData, "related");
    var relatedData = sData.getRange(2, relatedColumnIndex, numLists, 1).getValues();
    for (var i = 0; i < numLists; i++) {
        if (!listData[i][0]) {
            listData[i][0] = relatedData[i][0].replace(/,/g, " + ");
        }
    }
    sData.getRange(2, listColumnIndex, numLists, 1).setValues(listData);
}

function refreshParsed() {
    var urlTypes = ["viewUrl", "addUrl", "homeUrl", "forumUrl", "issuesUrl", "email", "donateUrl"];
    for (var i = 0, urlTypesLength = urlTypes.length; i < urlTypesLength; i++) {
        var columnIndex = getColIndex(sParsed, urlTypes[i]);
        var columnDataRange = sParsed.getRange(columnIndex + "2:" + columnIndex);
        columnDataRange.clearContent();
        var columnDataTopCell = sParsed.getRange(columnIndex + "2");
        switch (urlTypes[i]) {
            case "viewUrl":
                columnDataTopCell.setValue("=createHtmlViewLinkArray(INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(" + columnIndex + "1,Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(" + columnIndex + "1,Data!A1:1,0),4),\"1\",\"\")),Data!A2:A)");
                break;
            case "addUrl":
                var viewUrlColumnIndex = getColIndex(sData, "viewUrl");
                columnDataTopCell.setValue("=createHtmlAddLinkArray(INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(Data!" + viewUrlColumnIndex + "1,Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(Data!" + viewUrlColumnIndex + "1,Data!A1:1,0),4),\"1\",\"\")),Data!A2:A)");
                break;
            case "homeUrl":
                columnDataTopCell.setValue("=createHtmlHomeLinkArray(INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(" + columnIndex + "1,Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(" + columnIndex + "1,Data!A1:1,0),4),\"1\",\"\")),Data!A2:A)");
                break;
            case "forumUrl":
                columnDataTopCell.setValue("=createHtmlForumLinkArray(INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(" + columnIndex + "1,Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(" + columnIndex + "1,Data!A1:1,0),4),\"1\",\"\")),Data!A2:A)");
                break;
            case "issuesUrl":
                columnDataTopCell.setValue("=createHtmlIssuesLinkArray(INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(" + columnIndex + "1,Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(" + columnIndex + "1,Data!A1:1,0),4),\"1\",\"\")),Data!A2:A)");
                break;
            case "email":
                columnDataTopCell.setValue("=createHtmlEmailLinkArray(INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(" + columnIndex + "1,Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(" + columnIndex + "1,Data!A1:1,0),4),\"1\",\"\")),Data!A2:A)");
                break;
            case "donateUrl":
                columnDataTopCell.setValue("=createHtmlDonateLinkArray(INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(" + columnIndex + "1,Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(" + columnIndex + "1,Data!A1:1,0),4),\"1\",\"\")),Data!A2:A)");
                break;
            default:
        }
        var columnData = columnDataRange.getDisplayValues();
        columnDataRange.clearContent();
        columnDataRange.setValues(columnData);
    }
}

function refreshPublic() {
    var publicFields = ["list", "tags", "description", "links", "related"];
    for (var i = 0, publicFieldsLength = publicFields.length; i < publicFieldsLength; i++) {
        var columnIndex = getColIndex(sPublic, publicFields[i]);
        var columnDataRange = sPublic.getRange(columnIndex + "2:" + columnIndex);
        columnDataRange.clearContent();
        var columnDataTopCell = sPublic.getRange(columnIndex + "2");
        switch (publicFields[i]) {
            case "list":
                columnDataTopCell.setValue("=createHtmlListNameArray(INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(\"list\",Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(\"list\",Data!A1:1,0),4),\"1\",\"\")))");
                break;
            case "tags":
                columnDataTopCell.setValue("=ARRAYFORMULA(\"<span class=\"\"fl-tag lang\"\">\"&INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(\"tagLang\",Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(\"tagLang\",Data!A1:1,0),4),\"1\",\"\"))&\"</span>\")");
                break;
            case "description":
                if (getColIndex(sData, "descrSourceUrl")) {
                    columnDataTopCell.setValue("=ARRAYFORMULA(IF(ISBLANK(INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(\"descrSourceUrl\",Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(\"descrSourceUrl\",Data!A1:1,0),4),\"1\",\"\"))),,\"<blockquote cite=\"\"\")&INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(\"descrSourceUrl\",Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(\"descrSourceUrl\",Data!A1:1,0),4),\"1\",\"\"))&IF(ISBLANK(INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(\"descrSourceUrl\",Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(\"descrSourceUrl\",Data!A1:1,0),4),\"1\",\"\"))),,\"\"\">\")&INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(\"descr\",Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(\"descr\",Data!A1:1,0),4),\"1\",\"\"))&IF(ISBLANK(INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(\"descrSourceUrl\",Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(\"descrSourceUrl\",Data!A1:1,0),4),\"1\",\"\"))),,\"</blockquote>\"))");
                } else {
                    columnDataTopCell.setValue("=ARRAYFORMULA(INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(\"descr\",Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(\"descr\",Data!A1:1,0),4),\"1\",\"\")))");
                }
                break;
            case "links":
                columnDataTopCell.setValue("=ARRAYFORMULA(IF(Parsed!A2:A=\"\",\"\",\"<p>\"&Parsed!A2:A&Parsed!B2:B&Parsed!C2:C&Parsed!D2:D&Parsed!E2:E&Parsed!F2:F&Parsed!G2:G&\"</p>\"))");
                break;
            case "related":
                columnDataTopCell.setValue("=createHtmlRelatedLinkArray(INDIRECT(\"Data!\"&SUBSTITUTE(ADDRESS(1,MATCH(\"related\",Data!A1:1,0),4),\"1\",\"2\")&\":\"&SUBSTITUTE(ADDRESS(1,MATCH(\"related\",Data!A1:1,0),4),\"1\",\"\")))");
                break;
            default:
        }
        var columnData = columnDataRange.getDisplayValues();
        columnDataRange.clearContent();
        columnDataRange.setValues(columnData);
    }
}