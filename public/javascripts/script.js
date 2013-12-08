$(function() {
    SirTrevor.setDefaults({blockTypes: ["Image", "Quote", "Text"]});
    $('.js-st-edit').each(function(){ new SirTrevor.Editor({el: $(this)}); });
});

var a;

$(function() {
    $('.add-comment').click(function(e){
        var addComment = $('.add-comment-blk');
        addComment.closest('.comment').find('.add-comment').show();
        addComment.find('input[name="comment-path"]').val($(e.target).data('path'));
        $(e.target).hide();
        $(e.target).closest('.comment-actions').after(addComment);
    });
});
