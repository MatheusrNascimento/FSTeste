CREATE PROC FI_SP_AltBeneficiario
    @NOME          VARCHAR (50) ,
	@CPF           VARCHAR (11) ,
	@ID			   BIGINT
AS
BEGIN
	UPDATE CLIENTES 
	SET 
		Nome = @NOME, 
		CPF =  @CPF
	WHERE Id = @Id
END