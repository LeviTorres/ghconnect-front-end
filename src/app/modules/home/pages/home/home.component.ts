import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public servicesTemp: any[] = []
  public filters: any[] = [
    { name: 'Ventas', completed: false },
    { name: 'Contabilidad', completed: false },
    { name: 'Tesoreria', completed: false },
    { name: 'Operaciones', completed: false },
    { name: 'Productividad', completed: false },
    { name: 'Recursos Humanos', completed: false }
  ]
  public services: any[] = [
    { name: 'Aprobaciones', icon: '../../../../../assets/newIcons/Aprobaciones.svg', type: '' },
    { name: 'Arrendamiento', icon: '../../../../../assets/newIcons/Arrendamiento.svg', type: '' },
    { name: 'Asistencia', icon: '.../../../../../assets/newIcons/Asistencia.svg', type: '' },
    { name: 'Clientes', icon: '../../../../../assets/newIcons/Clientes.svg', type: '' },
    { name: 'Comidas', icon: '../../../../../assets/newIcons/Comidas.svg', type: '' },
    { name: 'Compras', icon: './../../../../assets/newIcons/Compras.svg', type: '' },
    { name: 'Contratos y Subcontratos', icon: '../../../../../assets/newIcons/Contratos y subcontratos.svg', type: '' },
    { name: 'CRM', icon: '../../../../../assets/newIcons/CRM.svg', type: '' },
    { name: 'Cuadro Comparativo', icon: '../../../../../assets/newIcons/Cuadro comparativo.svg', type: '' },
    { name: 'e-Learning', icon: '../../../../../assets/newIcons/eLearning.svg', type: '' },
    { name: 'Empleados', icon: '../../../../../assets/newIcons/Empleados.svg', type: '' },
    { name: 'Encuestas', icon: '../../../../../assets/newIcons/Encuestas.svg', type: '' },
    { name: 'Eventos', icon: '../../../../../assets/newIcons/Eventos.svg', type: '' },
    { name: 'Facturacion', icon: '../../../../../assets/newIcons/Facturación.svg', type: '' },
    { name: 'Flota', icon: '../../../../../assets/newIcons/Flota.svg', type: '' },
    { name: 'Geston de Archivos', icon: '../../../../../assets/newIcons/Gestión de Archivos.svg', type: '' },
    { name: 'Inventario', icon: '../../../../../assets/newIcons/Inventario.svg', type: '' },
    { name: 'Mantenimiento', icon: '../../../../../assets/newIcons/Mantenimiento.svg', type: '' },
    { name: 'Nomina', icon: '../../../../../assets/newIcons/Nómina.svg', type: '' },
    { name: 'Organigrama', icon: '../../../../../assets/newIcons/Organigrama.svg', type: '' },
    { name: 'Pedidos', icon: '../../../../../assets/newIcons/Pedidos.svg', type: '' },
    { name: 'Precio Unitario', icon: '../../../../../assets/newIcons/Precio Unitario.svg', type: '' },
    { name: 'Presupuestos', icon: '../../../../../assets/newIcons/Presupuestos.svg', type: '' },
    { name: 'Proceso de Seleccion', icon: '../../../../../assets/newIcons/Proceso de selección.svg', type: '' },
    { name: 'Recomendaciones Empleados', icon: '../../../../../assets/newIcons/Recomendaciones de empleados.svg', type: '' },
    { name: 'Remesas', icon: '../../../../../assets/newIcons/Remesas.svg', type: '' },
    { name: 'Suscripciones', icon: '../../../../../assets/newIcons/Suscripciones.svg', type: '' },
    { name: 'Administracion de Habilidades', icon: '../../../../../assets/newIcons/Administración de habilidades.svg', type: '' },
    { name: 'Mesa de Ayuda', icon: '../../../../../assets/newIcons/../../../../../assets/newIcons/Mesa de Ayuda.svg', type: '' },
    { name: 'Gastos de Representacion', icon: '../../../../../assets/newIcons/Gastos de representación.svg', type: '' },
    { name: 'Bancos', icon: '../../../../../assets/newIcons/Bancos.svg', type: '' },
    { name: 'Politicas', icon: '../../../../../assets/newIcons/Políticas.svg', type: '' },
    { name: 'Evaluaciones', icon: '../../../../../assets/newIcons/Evaluaciones.svg', type: '' },
    { name: 'Contratos Empleados', icon: '../../../../../assets/newIcons/Contratos empleados.svg', type: '' },
    { name: 'Proveedores', icon: '../../../../../assets/newIcons/Proveedores.svg', type: '' },
    { name: 'Cuentas Bancarias', icon: '../../../../../assets/newIcons/Cuentas bancarias.svg', type: '' },
    { name: 'Validaciones', icon: '../../../../../assets/newIcons/Validaciones.svg', type: '' },
  ]


  constructor() { }

  ngOnInit(): void {
    this.servicesTemp = this.services
    //this.filters
    console.log(this.filters);

  }

  filterData(event:any){
    console.log(event);
  }



  search(term: string) {
    console.log(term);
    if(term){
      const termino = term.toLowerCase().trim()
      let data = this.servicesTemp.filter((item:any) => item.name.toLowerCase().trim().includes(termino))
      this.services = data
    }else {
      this.services = this.servicesTemp
    }
  }
}
