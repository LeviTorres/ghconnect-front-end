import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public servicesTemp: any[] = []
  public servicesFilters:any[] = []
  public services: any[] = [
    { name: 'Aprobaciones', icon: '../../../../../assets/newIcons/Aprobaciones.svg', type: 'Recursos Humanos' },
    { name: 'Arrendamiento', icon: '../../../../../assets/newIcons/Arrendamiento.svg', type: 'Ventas' },
    { name: 'Asistencia', icon: '.../../../../../assets/newIcons/Asistencia.svg', type: 'Recursos Humanos' },
    { name: 'Clientes', icon: '../../../../../assets/newIcons/Clientes.svg', type: 'Contabilidad' },
    { name: 'Comidas', icon: '../../../../../assets/newIcons/Comidas.svg', type: 'Recursos Humanos' },
    { name: 'Compras', icon: './../../../../assets/newIcons/Compras.svg', type: 'Contabilidad' },
    { name: 'Contratos y Subcontratos', icon: '../../../../../assets/newIcons/Contratos y subcontratos.svg', type: 'Operaciones' },
    { name: 'CRM', icon: '../../../../../assets/newIcons/CRM.svg', type: 'Ventas' },
    { name: 'Cuadro Comparativo', icon: '../../../../../assets/newIcons/Cuadro comparativo.svg', type: 'Operaciones' },
    { name: 'e-Learning', icon: '../../../../../assets/newIcons/eLearning.svg', type: 'Productividad' },
    { name: 'Empleados', icon: '../../../../../assets/newIcons/Empleados.svg', type: 'Recursos Humanos' },
    { name: 'Encuestas', icon: '../../../../../assets/newIcons/Encuestas.svg', type: 'Productividad' },
    { name: 'Eventos', icon: '../../../../../assets/newIcons/Eventos.svg', type: 'Productividad' },
    { name: 'Facturacion', icon: '../../../../../assets/newIcons/Facturación.svg', type: 'Contabilidad' },
    { name: 'Flota', icon: '../../../../../assets/newIcons/Flota.svg', type: 'Operaciones' },
    { name: 'Geston de Activos', icon: '../../../../../assets/newIcons/Gestión de Archivos.svg', type: 'Contabilidad' },
    { name: 'Inventario', icon: '../../../../../assets/newIcons/Inventario.svg', type: 'Contabilidad' },
    { name: 'Mantenimiento', icon: '../../../../../assets/newIcons/Mantenimiento.svg', type: 'Operaciones' },
    { name: 'Nomina', icon: '../../../../../assets/newIcons/Nómina.svg', type: 'Recursos Humanos' },
    { name: 'Organigrama', icon: '../../../../../assets/newIcons/Organigrama.svg', type: 'Recursos Humanos' },
    { name: 'Pedidos', icon: '../../../../../assets/newIcons/Pedidos.svg', type: 'Ventas' },
    { name: 'Precio Unitario', icon: '../../../../../assets/newIcons/Precio Unitario.svg', type: 'Operaciones' },
    { name: 'Presupuestos', icon: '../../../../../assets/newIcons/Presupuestos.svg', type: 'Operaciones' },
    { name: 'Proceso de Seleccion', icon: '../../../../../assets/newIcons/Proceso de selección.svg', type: 'Recursos Humanos' },
    { name: 'Recomendaciones de Empleados', icon: '../../../../../assets/newIcons/Recomendaciones de empleados.svg', type: 'Recursos Humanos' },
    { name: 'Remesas', icon: '../../../../../assets/newIcons/Remesas.svg', type: 'Tesoreria' },
    { name: 'Suscripciones', icon: '../../../../../assets/newIcons/Suscripciones.svg', type: 'Ventas' },
    { name: 'Administracion de Habilidades', icon: '../../../../../assets/newIcons/Administración de habilidades.svg', type: 'Recursos Humanos' },
    { name: 'Mesa de Ayuda', icon: '../../../../../assets/newIcons/../../../../../assets/newIcons/Mesa de Ayuda.svg', type: 'Productividad' },
    { name: 'Gastos de Representacion', icon: '../../../../../assets/newIcons/Gastos de representación.svg', type: 'Recursos Humanos' },
    { name: 'Bancos', icon: '../../../../../assets/newIcons/Bancos.svg', type: 'Tesoreria' },
    { name: 'Politicas', icon: '../../../../../assets/newIcons/Políticas.svg', type: 'Productividad' },
    { name: 'Evaluaciones', icon: '../../../../../assets/newIcons/Evaluaciones.svg', type: 'Recursos Humanos' },
    { name: 'Contratos Empleados', icon: '../../../../../assets/newIcons/Contratos empleados.svg', type: 'Recursos Humanos' },
    { name: 'Proveedores', icon: '../../../../../assets/newIcons/Proveedores.svg', type: 'Contabilidad' },
    { name: 'Cuentas Bancarias', icon: '../../../../../assets/newIcons/Cuentas bancarias.svg', type: 'Tesoreria' },
    { name: 'Validaciones', icon: '../../../../../assets/newIcons/Validaciones.svg', type: 'Productividad' },
    { name: 'Pagos de Clientes', icon: '../../../../../assets/newIcons/Cuentas bancarias.svg', type: 'Tesoreria' },
    { name: 'Pagos a proveedores', icon: '../../../../../assets/newIcons/Validaciones.svg', type: 'Tesoreria' },
  ]

  public filters: any[] = [
    { name: 'Todos'},
    { name: 'Ventas'},
    { name: 'Contabilidad'},
    { name: 'Tesoreria'},
    { name: 'Operaciones'},
    { name: 'Productividad'},
    { name: 'Recursos Humanos'}
  ]

  public selectedFilter: string = 'Todos'

  constructor() { }

  ngOnInit(): void {
    this.servicesTemp = this.services
  }

  selected(value:string){
    if(value === 'Todos'){
      this.services = this.servicesTemp
      this.servicesFilters = this.servicesTemp
    }else {
      this.services = this.servicesTemp.filter((element:any) => element.type === value)
      this.servicesFilters = this.services
    }
  }

  search(term: string) {
    if(term){
      const termino = term.toLowerCase().trim()
      let data = this.servicesFilters.filter((item:any) => item.name.toLowerCase().trim().includes(termino))
      this.services = data
    }else {
      this.services = this.servicesFilters
    }
  }
}
