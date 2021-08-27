// Needs :
// <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
// <script src="BibTex.js"></script>

var expanded_venues = [
    "3DV",   "International Conference on 3D Vision",
    "ACCV",  "Proceedings of the Asian Conference on Computer Vision (<b>ACCV</b>)",
    "arXiv", "arXiv",
    "ARXIV", "arXiv",
    "BMVC",  "Proceedings of the British  Machine Vision Conference (<b>BMVC</b>)",
    "CVIU",  "Computer Vision and Image Understanding (<b>CVIU</b>)",
    "CVPR",  "Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (<b>CVPR</b>)",
    "ECCV",  "Proceedings of the European Conference on Computer Vision (<b>ECCV</b>)",
    "ICCV",  "Proceedings of the International Conference on Computer Vision (<b>ICCV</b>)",
    "ICCV Workshop", "do not expand",
    "ICCVW", "Workshop at the International Conference on Computer Vision (<b>ICCV Workshop</b>)",
    "IJCV",  "International Journal of Computer Vision (<b>IJCV</b>)",
    "ISMAR", "Proceedings of the International Symposium on Mixed and Augmented Reality (<b>ISMAR</b>)",
    "MICCAI", "Proceedings of the Conference on  Medical Image Computing and Computer Assisted Intervention (<b>MICCAI</b>)",
    "NIPS",  "Advances in Neural Information Processing Systems (<b>NIPS</b>)",
    "PAMI",  "IEEE Transactions on Pattern Analysis and Machine Intelligence (<b>PAMI</b>)",
    "VR",    "Proceedings of the IEEE Virtual Reality Conference (<b>VR</b>)",
    "WACV",  "IEEE Winter Conference on Applications of Computer Vision (<b>WACV</b>)"
];

function uniformize_venue(venue) {
    v = expanded_venues;
    for(i = 0; i < v.length; i+=2) {
	if (venue == v[i]) {
	    return v[i+1];
	}
    }

    return venue;
}

function extract(entry, field)
{
    if (array_key_exists(field, entry)) {
	field_text = entry[field];
	field_text.replace(/\s+/, ' ');
	return trim(field_text);
    } else {
	return "";
    }
}

function entry2html(entry)
{
    ret = "";

    var weblink = extract(entry, 'weblink');
    if (weblink == "") {
	weblink = extract(entry, 'pdf');
    }
    if (weblink != "") {
	if (!weblink.includes("http")) {
		weblink = "https://vincentlepetit.github.io/publications/../files/" + weblink;
	}
    }
	
    ////////////////////////////////////////////////////////////////////////////////

    var title = "";
    if (entry['entryType'] == 'inbook') {
	title = extract(entry, 'chapter');
    } else {
	title = extract(entry, 'title');
    }
    var title_html = "";
    if (weblink != "") {
	title_html = "<a class=\"title\" href=\"" + weblink + "\">" + trim(title) + "</a>";
    } else {
	title_html = "<span class=\"title\">" + trim(title) + "</span>";
    }

    ////////////////////////////////////////////////////////////////////////////////

    var authors_html = ""
    if (array_key_exists('author', entry)) {
    	var N = entry['author'].length;
    	if (N == 1) {
    	    authors_html = bibtex_entries._formatAuthor(entry['author'][0]);
    	}
    	if (N == 2) {
    	    authors_html = bibtex_entries._formatAuthor(entry['author'][0]);
    	    authors_html += " and ";
    	    authors_html += bibtex_entries._formatAuthor(entry['author'][1]);
    	}
    	if (N >= 3) {
    	    for (var i = 0; i < N-1; i++) {
    		authors_html += bibtex_entries._formatAuthor(entry['author'][i]);
    		authors_html += ", "
    	    }
    	    authors_html += "and ";
    	    authors_html += bibtex_entries._formatAuthor(entry['author'][N-1]);
    	}
	authors_html = "<span class=\"authors\">" + authors_html + "</span>";
    }

    ////////////////////////////////////////////////////////////////////////////////

    var venue_html = "";

    if (entry['entryType'] == 'inproceedings') {
	var booktitle = extract(entry, 'booktitle')
	venue_html = "In <i>" + uniformize_venue(booktitle) + "</i>";
    } else if (entry['entryType'] == 'article') {
	var journal = extract(entry, 'journal')
	venue_html = uniformize_venue(journal);
    }

    ////////////////////////////////////////////////////////////////////////////////

    var year = extract(entry, 'year')
    var year_html = "<span class=\"year\">" + year + "</span>";

    ////////////////////////////////////////////////////////////////////////////////

    var note = extract(entry, 'note');
    var note_html = "";
    if (note != "") {
	note_html = "<span class=\"note\">" + note + "</span>";
    }

    ////////////////////////////////////////////////////////////////////////////////

    var project_html = "";
    var project = extract(entry, 'project');
    if (project != '') {
	project_html += "<p><a href = \"" + project + "\">Project page</a></p>"
    }
    
    ////////////////////////////////////////////////////////////////////////////////
    
    if (entry['entryType'] == 'inproceedings') {
	return title_html + ". " + authors_html + ". " + venue_html + ", " + year_html + ". " + note_html + project_html;
    } else if (entry['entryType'] == 'article') {
	return title_html + ". " + authors_html + ". " + venue_html + ", " + year_html + ". " + note_html + project_html;
    } else if (entry['entryType'] == 'inbook') {
	var booktitle = extract(entry, 'title');
	var booktitle_html = "Chapter in <span class=\"in\">" + booktitle + "</span>";
	var ret = title_html + ". " + authors_html + ". " + booktitle_html;
	var publisher = extract(entry, 'publisher');
	if (publisher != "") {
	    var publisher_html = "<span class=\"publisher\">" + publisher + "</span>";
	    ret += ". " + publisher_html;
	}
	ret += ", " + year_html + ". " + note_html + project_html;
	return ret;
    } else if (entry['entryType'] == 'techreport') {
	var ret = title_html + ". " + authors_html + ". ";
	ret += "<span class=\"in\">Technical Report</span>";
	var institution = extract(entry, 'institution');
	if (institution != "") {
	    ret += ", <span class=\"institution\">" + institution + "</span>";
	}
	var number = extract(entry, 'number');
	if (number != "") {
	    ret += ", <span class=\"number\">" + number + "</span>";
	}
	ret += ", " + year_html + ". " + note_html + project_html;
	return ret;
    } else if (entry['entryType'] == 'hdr') {
	return title_html + ". " + authors_html + ". " + venue_html + ", " + year_html + ". " + note_html + project_html;
    }

    ////////////////////////////////////////////////////////////////////////////////
        
    return "entry type not implemented for " + title;
}

function bibtex2html_BibTex(bibtex_entries)
{
    var year = Number(extract(bibtex_entries.data[0], 'year'))
    var min_year = year;
    var max_year = year;
    for (var i=0; i<bibtex_entries.data.length; i++){
	year = Number(extract(bibtex_entries.data[i], 'year'))
	if (year > max_year) { max_year = year; }
	if (year < min_year) { min_year = year; }
    }

    var ret = "";

    const uaDataIsMobile = window.navigator.userAgentData?.mobile;
    if (uaDataIsMobile) {
	    ret = "MOBILE";
    } else {
   	    ret = "NOT MOBILE";
    }
    ret += navigator.userAgent;
	
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    if (check) {
	    ret += "MOBILE2";
    } else {
	    ret += "NOT MOBILE2";
    }
	
    for (var current_year = max_year; current_year >= min_year; current_year--) {
	ret += "<h2>\n" + current_year.toString() + "</h2>\n";

	ret += "<table id=\"publis\">\n";

	for (var i=0; i<bibtex_entries.data.length; i++){
	    var entry = bibtex_entries.data[i];
	    var year = Number(extract(entry, 'year'));
	    if (year == current_year) {
		var img = extract(entry, 'img');
		var weblink = extract(entry, 'weblink');
		if (weblink == "") {
		  weblink = extract(entry, 'pdf');
		}
		entry_html = entry2html(entry);
		var anchor_html = "<a id=\"" + entry['cite'] + "\"></a>";		
		ret += anchor_html;

		ret += "<tr>\n";
		if (img != '') {
		    ret += "<td>";
		    if (weblink != '') {
			ret += "<a href = \"" + weblink + "\">";
		    }
		    ret += "<img alt = \"<missing>\" width = 300 src = \"https://vincentlepetit.github.io/" + img + "\" class = \"thumbnail\" ></img>";
		    if (weblink != '') {
			ret += "</a>";
		    }
		    ret += "</td><td>";
		    ret += entry_html;
		    ret += "</td></tr>\n";
		} else {
		    ret += "<td colspan=\"2\">";
		    ret += entry_html;
		    ret += "</td>";
		}
		ret += "</tr>\n";
	    }
	}
	ret += "</table>\n";
    }

    return ret;
}

function bibtex2html_bibfile(bibfile_name, list_of_publications_id)
{
    jQuery.get(bibfile_name, function(textString) {
	bibtex_entries = new BibTex();
	bibtex_entries.content = textString;
	bibtex_entries.parse();
	document.getElementById(list_of_publications_id).innerHTML = bibtex2html_BibTex(bibtex_entries);
    });
}
