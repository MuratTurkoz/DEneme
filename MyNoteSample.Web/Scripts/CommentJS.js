﻿var noteid = -1;
var modalCommentBodyId = "#modal_comment_body";


$(function () {

    $('#modal_comment').on('show.bs.modal', function (e) {

        var btn = $(e.relatedTarget);
        noteid = btn.data("note-id");

        $(modalCommentBodyId).load("/Comment/ShowNoteComments/" + noteid);
    })

});

function doComment(btn, e, commentid, spanid) {

    var button = $(btn);
    var mode = button.data("edit-mode");

    if (e === "edit_clicked") {
        if (!mode) {
            button.data("edit-mode", true);
            button.removeClass("btn-outline-warning");
            button.addClass("btn-outline-success");
            var btnSpan = button.find("svg");
            btnSpan.removeClass("fa-edit");
            btnSpan.addClass("fa-check");

            $(spanid).addClass("editable");
            $(spanid).attr("contenteditable", true);
            $(spanid).focus();
        }
        else {
            button.data("edit-mode", false);
            button.addClass("btn-outline-success");
            button.removeClass("btn-outline-warning");
            var btnSpan = button.find("svg");
            btnSpan.addClass("fa-check");
            btnSpan.removeClass("fa-edit");

            $(spanid).removeClass("editable");
            $(spanid).attr("contenteditable", false);

            var txt = $(spanid).text();

            $.ajax({
                method: "POST",
                url: "/Comment/Edit/" + commentid,
                data: { text: txt }
            }).done(function (data) {

                if (data.result) {
                    // yorumlar partial tekrar yüklenir..
                    $(modalCommentBodyId).load("/Comment/ShowNoteComments/" + noteid);
                }
                else {
                    alert("Yorum güncellenemedi.");
                }

            }).fail(function () {
                alert("Sunucu ile bağlantı kurulamadı.");
            });
        }

    }
    else if (e === "delete_clicked") {
        var dialog_res = confirm("Yorum silinsin mi?");
        if (!dialog_res) return false;

        $.ajax({
            method: "GET",
            url: "/Comment/Delete/" + commentid
        }).done(function (data) {

            if (data.result) {
                // yorumlar partial tekrar yüklenir..
                $(modalCommentBodyId).load("/Comment/ShowNoteComments/" + noteid);
            } else {
                alert("Yorum silinemedi.");
            }

        }).fail(function () {
            alert("Sunucu ile bağlantı kurulamadı.");
        });

    } else if (e === "new_clicked") {

        var txt = $("#new_comment_text").val();

        $.ajax({
            method: "POST",
            url: "/Comment/Create",
            data: { "text": txt, "noteid": noteid }
        }).done(function (data) {

            if (data.result) {
                // yorumlar partial tekrar yüklenir..
                $(modalCommentBodyId).load("/Comment/ShowNoteComments/" + noteid);
            } else {
                alert("Yorum eklenemedi.");
            }

        }).fail(function () {
            alert("Sunucu ile bağlantı kurulamadı.");
        });

    }

}