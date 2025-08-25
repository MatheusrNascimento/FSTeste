
$(document).ready(function () {

    $('#Cpf').mask('000.000.000-00');
    $('#Cpfbeneficiario').mask('000.000.000-00');
    $('#Telefone').mask('(00) 0000-0000');

    $('#formCadastro').submit(function (e) {

        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CPF": $(this).find("#Cpf").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "Beneficiarios": (function() {
                    let beneficiarios = [];

                    $('#beneficiariosTable tbody tr').each(function () {
                        var beneficiario = {
                            Id: $(this).find('td:eq(0)').text().trim(),
                            CPF: $(this).find('td:eq(1)').text().replace(".", "").replace(".", "").replace("-", "").trim(),
                            Nome: $(this).find('td:eq(2)').text().trim()
                        };

                        beneficiarios.push(beneficiario);
                    });

                    return beneficiarios;
                })()
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
            }
        });
    })

    Modalbeneficiarios();
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function Modalbeneficiarios() {
    const $lista = $('#beneficiariosTable tbody');
    const $cpfInput = $('#Cpfbeneficiario');
    const $nomeInput = $('#NomeBenefiario');

    const limparCampos = () => {
        $cpfInput.val('');
        $nomeInput.val('');
    };

    $('#btnIncluirBeneficiario').on('click', () => {
        console.log("Passou aqui poha")
        const cpf = $cpfInput.val().trim();
        const nome = $nomeInput.val().trim();

        if (!cpf) {
            ModalDialog("Erro", "Preencha o campo CPF para o beneficiário");
            return;
        }
        else if (!nome) {
            ModalDialog("Erro", "Preencha o campo Nome para o beneficiário");
            return;
        }

        const tr = `
            <tr>
                <td class="hidden-xs hidden" hidden>0</td>
                <td>${cpf.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2') }</td>
                <td>${nome}</td>
                <td class="text-right">
                    <button type="button" class="btn btn-sm btn-primary btnAlterarBeneficiario">Alterar</button>
                    <button type="button" class="btn btn-sm btn-primary btnExcluirBeneficiario">Excluir</button>
                </td>
            </tr>
        `;

        $lista.append(tr);
        limparCampos();
    });

    $('#beneficiariosTable').on('click', '.btnExcluirBeneficiario', function () {
        const $linha = $(this).closest('tr');
        const id = Number($linha.find('td:eq(0)').text());

        if (id > 0) {
            if (!confirm("Tem certeza que deseja excluir o beneficiário ?")) return;

            $.ajax({
                url: '/Cliente/ExcluirBeneficiario',
                method: "POST",
                data: { "Id": id },
                error:
                    function (r) {
                        if (r.Result === 400)
                            ModalDialog("Ocorreu um erro", "Tente novamento mais tarde!");
                        else if (r.status == 500)
                            ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                    },
                success:
                    function (r) {
                        if (r.Result === "OK") {
                            ModalDialog("Sucesso!", r.Message);
                            $linha.remove();
                        }
                        else {
                            ModalDialog("Error!", r.Message);
                        }
                    }
            });
        } else {
            $linha.remove();
        }
    });

    $('#beneficiariosTable').on('click', '.btnAlterarBeneficiario', function () {
        const $btn = $(this);
        const $linha = $btn.closest('tr');
        const $cpfColuna = $linha.find('td:eq(1)');
        const $nomeColuna = $linha.find('td:eq(2)');

        if ($linha.hasClass('em-edicao')) {
            const novosValores = $linha.find('input').map((_, el) => $(el).val()).get();

            $cpfColuna.text(novosValores[0]);
            $nomeColuna.text(novosValores[1]);

            $btn.text('Alterar').removeClass('btn-success').addClass('btn-primary');
            $linha.removeClass('em-edicao');
        } else {
            $cpfColuna.html(`<input id="beneficiario_Alt_CPF" type="text" class="form-control" style="width: 13rem;" value="${$cpfColuna.text()}">`);
            $nomeColuna.html(`<input type="text" class="form-control" style="width: 150px;" value="${$nomeColuna.text()}">`);

            $('#beneficiario_Alt_CPF').mask('000.000.000-00');

            $btn.text('Salvar').removeClass('btn-primary').addClass('btn-success');
            $linha.addClass('em-edicao');
        }
    });

    function pegarBeneficiarios() {

        let beneficiarios = [];

        $('#listaBeneficiarios tbody tr').each(function () {
            var beneficiario = {
                Id: $(this).find('td:eq(0)').text().trim(),
                CPF: $(this).find('td:eq(1)').text().trim(),
                Nome: $(this).find('td:eq(2)').text().trim()
            };

            beneficiarios.push(beneficiario);
        });

        return beneficiarios;
    }
}
