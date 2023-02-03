import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public servicesTemp: any[] = []
  public servicesFilters: any[] = []
  public services: any[] = [
    { name: 'Aprobaciones', icon: '../../../../../assets/newIcons/Aprobaciones.svg', type: 'Recursos Humanos', url: '/approvals' },
    { name: 'Arrendamiento', icon: '../../../../../assets/newIcons/Arrendamiento.svg', type: 'Ventas', url: '' },
    { name: 'Asistencia', icon: '.../../../../../assets/newIcons/Asistencia.svg', type: 'Recursos Humanos', url: '' },
    { name: 'Clientes', icon: '../../../../../assets/newIcons/Clientes.svg', type: 'Contabilidad', url: '/clients' },
    { name: 'Comidas', icon: '../../../../../assets/newIcons/Comidas.svg', type: 'Recursos Humanos', url: '' },
    { name: 'Compras', icon: './../../../../assets/newIcons/Compras.svg', type: 'Contabilidad', url: '' },
    { name: 'Contratos y Subcontratos', icon: '../../../../../assets/newIcons/Contratos y subcontratos.svg', type: 'Operaciones', url: '/contracts' },
    { name: 'CRM', icon: '../../../../../assets/newIcons/CRM.svg', type: 'Ventas', url: '' },
    { name: 'Cuadro Comparativo', icon: '../../../../../assets/newIcons/Cuadro comparativo.svg', type: 'Operaciones', url: '/validation' },
    { name: 'e-Learning', icon: '../../../../../assets/newIcons/eLearning.svg', type: 'Productividad', url: '' },
    { name: 'Empleados', icon: '../../../../../assets/newIcons/Empleados.svg', type: 'Recursos Humanos', url: '' },
    { name: 'Encuestas', icon: '../../../../../assets/newIcons/Encuestas.svg', type: 'Productividad', url: '' },
    { name: 'Eventos', icon: '../../../../../assets/newIcons/Eventos.svg', type: 'Productividad', url: '' },
    { name: 'Facturacion', icon: '../../../../../assets/newIcons/Facturación.svg', type: 'Contabilidad', url: '' },
    { name: 'Flota', icon: '../../../../../assets/newIcons/Flota.svg', type: 'Operaciones', url: '' },
    { name: 'Gestion de Activos', icon: '../../../../../assets/newIcons/Gestión de Archivos.svg', type: 'Contabilidad', url: '' },
    { name: 'Inventario', icon: '../../../../../assets/newIcons/Inventario.svg', type: 'Contabilidad', url: '' },
    { name: 'Mantenimiento', icon: '../../../../../assets/newIcons/Mantenimiento.svg', type: 'Operaciones', url: '' },
    { name: 'Nomina', icon: '../../../../../assets/newIcons/Nómina.svg', type: 'Recursos Humanos', url: '' },
    { name: 'Organigrama', icon: '../../../../../assets/newIcons/Organigrama.svg', type: 'Recursos Humanos', url: '' },
    { name: 'Pedidos', icon: '../../../../../assets/newIcons/Pedidos.svg', type: 'Ventas', url: '' },
    { name: 'Precio Unitario', icon: '../../../../../assets/newIcons/Precio Unitario.svg', type: 'Operaciones', url: '' },
    { name: 'Presupuestos', icon: '../../../../../assets/newIcons/Presupuestos.svg', type: 'Operaciones', url: '' },
    { name: 'Recomendaciones de Empleados', icon: '../../../../../assets/newIcons/Recomendaciones de empleados.svg', type: 'Recursos Humanos', url: '' },
    { name: 'Remesas', icon: '../../../../../assets/newIcons/Remesas.svg', type: 'Tesoreria', url: '' },
    { name: 'Proceso de Seleccion', icon: '../../../../../assets/newIcons/Proceso de selección.svg', type: 'Recursos Humanos', url: '' },
    { name: 'Suscripciones', icon: '../../../../../assets/newIcons/Suscripciones.svg', type: 'Ventas', url: '' },
    { name: 'Administracion de Habilidades', icon: '../../../../../assets/newIcons/Administración de habilidades.svg', type: 'Recursos Humanos', url: '' },
    { name: 'Mesa de Ayuda', icon: '../../../../../assets/newIcons/../../../../../assets/newIcons/Mesa de Ayuda.svg', type: 'Productividad', url: '' },
    { name: 'Gastos de Representacion', icon: '../../../../../assets/newIcons/Gastos de representación.svg', type: 'Recursos Humanos', url: '' },
    { name: 'Bancos', icon: '../../../../../assets/newIcons/Bancos.svg', type: 'Tesoreria', url: '' },
    { name: 'Politicas', icon: '../../../../../assets/newIcons/Políticas.svg', type: 'Productividad', url: '' },
    { name: 'Evaluaciones', icon: '../../../../../assets/newIcons/Evaluaciones.svg', type: 'Recursos Humanos', url: '' },
    { name: 'Contratos Empleados', icon: '../../../../../assets/newIcons/Contratos empleados.svg', type: 'Recursos Humanos', url: '' },
    { name: 'Proveedores', icon: '../../../../../assets/newIcons/Proveedores.svg', type: 'Contabilidad', url: '/providers' },
    { name: 'Cuentas Bancarias', icon: '../../../../../assets/newIcons/Cuentas bancarias.svg', type: 'Tesoreria', url: '' },
    { name: 'Validaciones', icon: '../../../../../assets/newIcons/Validaciones.svg', type: 'Productividad', url: '' },
    { name: 'Pagos de Clientes', icon: '../../../../../assets/newIcons/Cuentas bancarias.svg', type: 'Tesoreria', url: '/invoice-clients' },
    { name: 'Pagos a proveedores', icon: '../../../../../assets/newIcons/Validaciones.svg', type: 'Tesoreria', url: '/invoice-providers' },
  ]

  public filters: any[] = [
    { name: 'Todos' },
    { name: 'Ventas' },
    { name: 'Contabilidad' },
    { name: 'Tesoreria' },
    { name: 'Operaciones' },
    { name: 'Productividad' },
    { name: 'Recursos Humanos' }
  ]

  public selectedFilter: string = 'Todos'

  constructor(
    private _router: Router,
  ) {
    this.servicesTemp = this.services
    this.servicesFilters = this.servicesTemp
  }

  ngOnInit(): void {

  }

  changeAll() {
    this.selectedFilter = 'Todos'
    this.services = this.servicesTemp
    this.servicesFilters = this.services
  }

  selected(value: string) {
    if (value === 'Todos') {
      this.services = this.servicesTemp
      this.servicesFilters = this.services
    } else {
      this.services = this.servicesTemp.filter((element: any) => element.type === value)
      this.servicesFilters = this.services
    }
  }

  search(term: string) {
    if (term) {
      const termino = term.toLowerCase().trim()
      let data = this.servicesFilters.filter((item: any) => item.name.toLowerCase().trim().includes(termino))
      this.services = data
      console.log('this.services', this.services);
    } else {
      if (this.selectedFilter === 'Todos') {
        this.services = this.servicesTemp
      } else {
        this.services = this.servicesFilters
      }
    }
  }

}
