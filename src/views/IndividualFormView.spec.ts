import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import IndividualFormView from '@/views/IndividualFormView.vue';
import { useIndividualStore } from '@/stores/individualStore';
import { useVisitCartStore } from '@/stores/visitCartStore';
import { useRouter, useRoute } from 'vue-router';

// Mock das dependências
jest.mock('vue-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useRoute: () => ({ params: { id: 'test-id' }, query: {} }),
}));

describe('IndividualFormView', () => {
  let wrapper;
  let individualStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    individualStore = useIndividualStore();
    
    // Mock do serviço de individual para evitar chamadas de API reais
    individualStore.fetchById = jest.fn().mockResolvedValue({
      id: 'test-id',
      nome_completo: 'Maria Teste',
      healthConditions: { hipertensao_arterial: true }
    });
    individualStore.updateIndividual = jest.fn().mockResolvedValue({ id: 'test-id' });

    wrapper = mount(IndividualFormView, {
      global: {
        mocks: {
          $router: { push: jest.fn() },
          $route: { params: { id: 'test-id' } },
        },
      },
    });
  });

  it('deve carregar dados do cidadão corretamente', async () => {
    await wrapper.vm.$nextTick();
    expect(individualStore.fetchById).toHaveBeenCalledWith('test-id');
    // Verifica se os campos foram preenchidos
    expect(wrapper.vm.formData.nome_completo).toBe('Maria Teste');
  });

  it('deve chamar updateIndividual ao salvar alterações', async () => {
    // Simula preenchimento e clique no botão finalizar
    wrapper.vm.formData.nome_completo = 'Maria Editada';
    wrapper.vm.currentStep = 6;
    
    await wrapper.vm.handleNext();
    
    expect(individualStore.updateIndividual).toHaveBeenCalled();
  });
});
