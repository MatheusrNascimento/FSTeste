
using System.Linq;

namespace FI.WebAtividadeEntrevista.Utils
{
    public static class ExtencionsMethods
    {
        public static bool validarCPF(this string cpf)
        {
            if (string.IsNullOrWhiteSpace(cpf))
                return false;

            cpf = new string(cpf.Where(char.IsDigit).ToArray());

            if (cpf.Length != 11)
                return false;

            if (cpf.Distinct().Count() == 1)
                return false;

            int primeiroDigito = DigitoVerificador(cpf.Take(9).ToArray(), 10);
            if (primeiroDigito != (cpf[9] - '0'))
                return false;

            int segundoDigito = DigitoVerificador(cpf.Take(10).ToArray(), 11);
            if (segundoDigito != (cpf[10] - '0'))
                return false;

            return true;

        }

        private static int DigitoVerificador(char[] numeros, int pesoInicial)
        {
            int soma = 0;

            for (int i = 0; i < numeros.Length; i++)
            {
                soma += (numeros[i] - '0') * (pesoInicial - i);
            }

            int resto = soma % 11;
            return (resto < 2) ? 0 : 11 - resto;
        }
    }
}