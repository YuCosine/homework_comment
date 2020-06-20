$(document).ready(function() {
    'use strict';

    function newSubTitle() {
        var subtitle = '<div class="subtitle"><input type="text" class="subtitle-content" style="width:40%">';
        subtitle += '<button class="btn btn-link mr-3 pl-0 pr-0 btn-add-critic" type="button">添加评语</button>';
        subtitle += '<button class="btn btn-link mr-3 pl-0 pr-0 btn-delete" type="button">删除</button></div>';
        return subtitle;
    }

    function newCritic(is_all_critic) {
        var critic = '<div class="critic"><input type="checkbox">';
        critic += '<input type="text" class="critic-content" style="width:60%">';
        if (!is_all_critic) {
            critic += '分值<input type="text" class="set-score" style="width:30px" value="default-value">';
        }
        critic += '<button class="btn btn-link mr-3 pl-0 pr-0 btn-delete" type="button">删除</button>';
        critic += '<button class="btn btn-link mr-3 pl-0 pr-0 btn-add-before" type="button">前加</button>';
        critic += '<button class="btn btn-link mr-3 pl-0 pr-0 btn-add-after" type="button">后加</button></div>';
        if (!is_all_critic) {
            critic = critic.replace('default-value', parseFloat($('#set-unit-score').val()));
        }
        return critic;
    }

    $('#div-instruction').hide();
    $('#btn-instruction').click(function() {
        if ($('#div-instruction').is(':hidden')) {
            $('#div-instruction').show();
            $('#btn-instruction').text('隐藏使用说明');
        }
        else {
            $('#div-instruction').hide();
            $('#btn-instruction').text('使用说明');

        }
    });

    $('.btn-add-subtitle').click(function() {
        $(this).parent().append(newSubTitle());
    });

    $('#left-panel').on('click', '.btn-add-critic', function() {
        $(this).parent().append(newCritic($(this).parent().find('.card-title').text() == '总体评价'));
    });

    $('#left-panel').on('click', '.btn-delete', function() {
        $(this).parent().remove();
    });

    $('#left-panel').on('click', '.btn-add-before', function() {
        $(this).parent().before(newCritic($(this).parent().parent().find('.card-title').text() == '总体评价'));
    });

    $('#left-panel').on('click', '.btn-add-after', function() {
        $(this).parent().after(newCritic($(this).parent().parent().find('.card-title').text() == '总体评价'));
    });

    $('#div-sys').on('change', '.set-score', function(){
        if (isNaN(parseFloat($(this).val()))) {
            $(this).val(0);
        }
    });

    $('#do-cal-score').click(function(){
        var cal_score = 0;
        var pro_score = 0;
        // var unit_score = parseFloat($('#set-unit-score').val());
        var sum_score = parseFloat($('#set-total-score').val());
        if ($('#contain-cal').is(':checked')) {
            $('#cal-critic :checkbox').each(function(){
                if (this.checked) {
                    cal_score += parseFloat($(this).parent().find('.set-score').val());
                }
            });
            $('#cal-score').val('+' + cal_score);
            sum_score += cal_score;
        }
        if ($('#contain-pro').is(':checked')) {
            $('#pro-critic :checkbox').each(function(){
                if (this.checked) {
                    pro_score -= parseFloat($(this).parent().find('.set-score').val());
                }
            });
            $('#pro-score').val(pro_score);
            sum_score += pro_score;
        }
        $('#all-score').val(sum_score);
    });

    $('.sub-score').change(function(){
        var sum_score = parseFloat($('#set-total-score').val()) + parseFloat($('#cal-score').val()) + parseFloat($('#pro-score').val());
        $('#all-score').val(sum_score);
    });

    $('#do-final-critic').click(function(){
        var title = {'cal-critic': '加分项', 'pro-critic': '未完成项', 'all-critic': '总分'};
        var critic = '';
        for (let critic_type of ['cal-critic', 'pro-critic', 'all-critic']) {
            if (!$('#contain-' + critic_type.slice(0, 3)).is(':checked')) {
                continue;
            }
            var score = $('#' + critic_type.slice(0, 3) + '-score').val();
            if (score != 0){
                critic += title[critic_type] + '共' + score + '\n';
            }
            $('#' + critic_type + ' .subtitle').each(function(){
                var sub_critic = '';
                $(this).find('.critic').each(function() {
                    if ($(this).find(':checkbox').is(':checked')) {
                        sub_critic += '\t' + $(this).find('.critic-content').val();
                        if (critic_type == 'cal-critic') {
                            score = $(this).find('.set-score').val();
                            sub_critic += ' +' + score;
                        }
                        if (critic_type == 'pro-critic') {
                            score = $(this).find('.set-score').val();
                            sub_critic += ' -' + score;
                        }
                        sub_critic += '\n';
                    }
                });
                if (sub_critic.length > 0) {
                    sub_critic = '\t' + $(this).find('.subtitle-content').val() + '\n' + sub_critic
                    critic += sub_critic;
                }
            });
            $('#' + critic_type + '>.critic').each(function(){
                if ($(this).find(':checkbox').is(':checked')) {
                    critic += '\t' + $(this).find('.critic-content').val();
                    if (critic_type == 'cal-critic') {
                        score = $(this).find('.set-score').val();
                        critic += ' +' + score;
                    }
                    if (critic_type == 'pro-critic') {
                        score = $(this).find('.set-score').val();
                        critic += ' -' + score;
                    }
                    critic += '\n';
                }
            });
        }
       $('#final-critic').val(critic);
    });

    $('#do-clear').click(function(){
        $('#left-panel :checkbox').prop('checked', false);
        $('#right-panel :input').not('.set-score').val('');
    });

    // 点击自动复制
    // click events
    // 添加点击事件
    document.body.addEventListener('click', copy, true);

    // event handler
    // 添加时间处理方法
    function copy(e) {

    // find target element
    // 搜索目标元素
    var
      t = e.target,
      c = t.dataset.copytarget,
      inp = (c ? document.querySelector(c) : null);

    // is element selectable?
    // 判断元素是否能被选中
    if (inp && inp.select) {

      // select text
      // 选择文本
      inp.select();

      try {
        // copy text
        // 复制文本
        document.execCommand('copy');
        inp.blur();
      }
      catch (err) {
        alert('please press Ctrl/Cmd+C to copy');
      }

    }

    }

    // load critic
    const ipt = document.getElementById('load-critic');


    // const ipt = document.createElement('input')
    // ipt.type = 'file'
    // ipt.style.display = 'none'
    // document.body.appendChild(ipt)
    // ipt.click()

    ipt.onchange = () => {
        const files = ipt.files[0];
        const reader = new FileReader();
        reader.readAsText(files);
        reader.onload = () => {
            const res = JSON.parse(reader.result);
            for (let critic_type of ['cal-critic', 'pro-critic', 'all-critic']) {
                for (let item of res[critic_type]) {
                    var parent = $('#' + critic_type);
                    var is_all_critic = (critic_type == 'all-critic');
                    if (item.type == 'subtitle') {
                        // add subtitle
                        var subtitle = newSubTitle();
                        parent.append(subtitle);
                        var sub_parent = parent.children().last();
                        sub_parent.find(".subtitle-content").val(item.contents);
                        for (let sub_item of item.critic) {
                            // add critic
                            var critic = newCritic();
                            sub_parent.append(critic);
                            sub_parent.children().last().find(".critic-content").val(sub_item[0]);
                            sub_parent.children().last().find(".set-score").val(sub_item[1]);
                        }
                    }
                    else{
                        // add critic
                        var critic = newCritic(is_all_critic);
                        parent.append(critic);
                        parent.children().last().find(".critic-content").val(item.contents[0]);
                        if (!is_all_critic) {
                            parent.children().last().find(".set-score").val(item.contents[1]);
                        }
                    }
                }
            }
        }
    }


    const eleLink = document.getElementById('btn-save-critic');

    $('#btn-output-critic').click(function(){
        eleLink.download = 'critic.json';
        // 字符内容转变成blob地址
        var json = {'cal-critic':[], 'pro-critic':[], 'all-critic':[]};
        for (let critic_type of ['cal-critic', 'pro-critic', 'all-critic']) {
            $('#'+critic_type+' .subtitle').each(function(){
                var subtitle = {'type': 'subtitle'};
                subtitle.contents = $(this).find('.subtitle-content').val();
                var critic = [];
                $(this).find('.critic-content').each(function(){
                    critic.push([this.value, $(this).parent().find('.set-score').val()]);
                })
                if (critic.length > 0) {subtitle.critic = critic;}
                json[critic_type].push(subtitle);
            });
            $('#'+critic_type+'>.critic').each(function(){
                var critic = {'type': 'critic'};
                critic.contents = [$(this).find('.critic-content').val(), $(this).find('.set-score').val()];
                json[critic_type].push(critic);
            });
        }
        console.log(json);

        const blob = new Blob(
            [JSON.stringify(json)],
            {type: "text/plain;charset=utf-8"}
        )
        eleLink.href = URL.createObjectURL(blob)
        eleLink.click()
    })


});