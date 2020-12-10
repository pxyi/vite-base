CKEDITOR.dialog.add("kityformula", function (editor) {
    var jme_fid = "kityformula_" + Math.ceil(Math.random()*10) ;
    return {
        title: "数学公式编辑器",
        minWidth: "500px",
        minHeight: "500px",
        contents: [{
            id: "tab1", label: "", title: "", expand: true, width: "785px", height: "390px", padding: 0,
            elements: [{
                type: "html",
                html: '<div style="width:785px;height:390px;"><iframe id="'+jme_fid+'" style="width:785px;height:390px;" frameborder="no" src="' + CKEDITOR.basePath + 'plugins/kityformula/kityFormulaDialog.html"></iframe></div>'
            }]
        }],
        onOk: function () {
            //点击确定按钮后的操作
            document.getElementById(jme_fid).contentWindow.onok(editor);
            return true;
        },
        onShow: function(){
            if (editor.getSelection().getType() == CKEDITOR.SELECTION_ELEMENT && editor.getSelection().getSelectedElement().getName() =='img') {
                var latex_data = editor.getSelection().getSelectedElement().getAttribute("latex-data");
                var data_latex = editor.getSelection().getSelectedElement().getAttribute("data-latex");
                var mathml = latex_data != null?latex_data:data_latex;
                document.getElementById(jme_fid).contentWindow.setlatex(mathml);
            }
        }
    }
});


